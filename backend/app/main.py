"""
main.py
─────────────────────────
FastAPI app for the هەڵەچن (correction) upload service.

Routes:
    GET  /health                 liveness/readiness check
    POST /api/correct            upload a .docx, get the corrected .docx back
    POST /api/cache/invalidate   force the next request to refetch from
                                  Supabase (protected by ADMIN_TOKEN)

Security posture, matching the project's requirements:
    * CORS is locked to ALLOWED_ORIGINS (no wildcard) — only the deployed
      site (and whatever local dev origins you add) can call this API.
    * The Supabase service role key and the correction dictionary itself
      never leave the server; the browser only ever sees a .docx byte
      stream back.
    * All unexpected exceptions are logged server-side with full detail and
      converted to a generic Kurdish message before reaching the client.
"""

from __future__ import annotations

import io
import logging

from fastapi import FastAPI, File, HTTPException, Request, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, StreamingResponse

from . import messages
from .config import settings
from .correction_engine import CorrectionEngineError, InvalidDocxError, correct_docx_bytes
from .supabase_client import SupabaseConnectionError, SupabaseQueryError, corrections_cache

logger = logging.getLogger("helachin")
logging.basicConfig(level=logging.INFO)

DOCX_MEDIA_TYPE = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"

app = FastAPI(title="Ranew Helachin Correction API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
    # Content-Disposition (carries the corrected filename) is not in the
    # browser's default cross-origin header allowlist, so it must be
    # explicitly exposed or the frontend's xhr.getResponseHeader() call
    # silently returns null.
    expose_headers=["Content-Disposition"],
)


@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    # Last-resort safety net: never let a raw traceback or exception message
    # reach the browser. Full detail goes to the server log only.
    logger.exception("Unhandled exception on %s %s", request.method, request.url.path)
    return JSONResponse(status_code=500, content={"detail": messages.UNEXPECTED_ERROR})


@app.get("/health")
def health():
    return {"status": "ok", "cache": corrections_cache.status()}


def _read_upload_within_limit(file: UploadFile, max_mb: int) -> bytes:
    max_bytes = max_mb * 1024 * 1024
    chunks: list[bytes] = []
    total = 0
    while True:
        chunk = file.file.read(1024 * 1024)
        if not chunk:
            break
        total += len(chunk)
        if total > max_bytes:
            raise HTTPException(status_code=413, detail=messages.TOO_LARGE)
        chunks.append(chunk)
    return b"".join(chunks)


def _build_output_filename(original_name: str) -> str:
    stem = original_name.rsplit(".", 1)[0] if "." in original_name else original_name
    stem = stem.strip() or "document"
    return f"{stem}_corrected.docx"


@app.post("/api/correct")
def correct_document(file: UploadFile = File(...)):
    filename = file.filename or ""
    if not filename.lower().endswith(".docx"):
        raise HTTPException(status_code=400, detail=messages.UNSUPPORTED_TYPE)

    raw_bytes = _read_upload_within_limit(file, settings.MAX_UPLOAD_MB)
    if not raw_bytes:
        raise HTTPException(status_code=400, detail=messages.EMPTY_FILE)

    try:
        dictionary_entries = corrections_cache.get_entries()
    except (SupabaseConnectionError, SupabaseQueryError) as exc:
        logger.error("Supabase fetch failed: %s", exc)
        raise HTTPException(status_code=503, detail=messages.DB_UNAVAILABLE) from exc

    if not dictionary_entries:
        logger.error("Correction dictionary is empty; refusing to process uploads.")
        raise HTTPException(status_code=503, detail=messages.DB_UNAVAILABLE)

    try:
        corrected_bytes, stats = correct_docx_bytes(raw_bytes, dictionary_entries)
    except InvalidDocxError as exc:
        logger.warning("Invalid .docx upload (%s): %s", filename, exc)
        raise HTTPException(status_code=400, detail=messages.CORRUPTED_FILE) from exc
    except CorrectionEngineError as exc:
        logger.exception("Correction engine failed on %s", filename)
        raise HTTPException(status_code=500, detail=messages.PROCESSING_FAILED) from exc

    logger.info("Corrected %s: %s", filename, stats)

    output_name = _build_output_filename(filename)
    return StreamingResponse(
        io.BytesIO(corrected_bytes),
        media_type=DOCX_MEDIA_TYPE,
        headers={"Content-Disposition": f'attachment; filename="{output_name}"'},
    )


@app.post("/api/cache/invalidate")
def invalidate_cache(request: Request):
    if not settings.ADMIN_TOKEN:
        raise HTTPException(status_code=404)
    provided = request.headers.get("X-Admin-Token")
    if provided != settings.ADMIN_TOKEN:
        raise HTTPException(status_code=401, detail="Unauthorized")
    corrections_cache.invalidate()
    return {"status": "invalidated"}
