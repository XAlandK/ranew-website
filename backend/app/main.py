"""
main.py
─────────────────────────
FastAPI app for the هەڵەچن (correction) upload service.

Routes:
    GET  /health                        liveness/readiness check
    POST /api/correct                   upload a .docx, get back a job id
    GET  /api/correct/{job_id}          poll job status
    GET  /api/correct/{job_id}/download download the corrected .docx once done
    POST /api/correct-text              correct pasted text synchronously,
                                         returns corrected HTML (with
                                         highlights) and plain text
    POST /api/cache/invalidate          force the next request to refetch
                                         from Supabase (protected by ADMIN_TOKEN)

Correction runs as a background job (see jobs.py) rather than inline in the
POST handler: a large real document can take minutes to process (the
correction algorithm itself, unchanged, is simply slow at that scale), which
is far longer than a browser or reverse-proxy will hold an HTTP request open.
The upload endpoint returns a job id immediately; the frontend polls for
completion instead.

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
from urllib.parse import quote

from fastapi import FastAPI, File, HTTPException, Request, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, StreamingResponse
from pydantic import BaseModel

from . import messages
from .config import settings
from .correction_engine import (
    CorrectionEngineError,
    InvalidDocxError,
    correct_docx_bytes,
    correct_text,
)
from .jobs import JobError, job_store
from .supabase_client import (
    SupabaseConnectionError,
    SupabaseQueryError,
    corrections_cache,
    skipped_words_cache,
)

JOB_ERROR_MESSAGES = {
    "corrupted": messages.CORRUPTED_FILE,
    "processing": messages.PROCESSING_FAILED,
    "unexpected": messages.UNEXPECTED_ERROR,
}

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
    return {
        "status": "ok",
        "corrections_cache": corrections_cache.status(),
        "skipped_words_cache": skipped_words_cache.status(),
    }


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


def _content_disposition(filename: str) -> str:
    """Build a Content-Disposition value safe for names outside Latin-1
    (e.g. Kurdish/Arabic script) — HTTP headers can only hold Latin-1 bytes,
    so a raw non-ASCII filename in `filename="..."` crashes the response
    with UnicodeEncodeError. RFC 6266 covers this with two parameters: an
    ASCII-safe `filename` for old clients, and `filename*` (UTF-8,
    percent-encoded) that every current browser prefers when present.
    """
    ascii_fallback = filename.encode("ascii", "ignore").decode("ascii").strip() or "corrected.docx"
    encoded = quote(filename)
    return f'attachment; filename="{ascii_fallback}"; filename*=UTF-8\'\'{encoded}'


@app.post("/api/correct", status_code=202)
def start_correction(file: UploadFile = File(...)):
    """Validate the upload and the currently-cached data synchronously (all
    fast), then hand the actual correction work to a background job and
    return its id right away — see jobs.py for why."""
    filename = file.filename or ""
    if not filename.lower().endswith(".docx"):
        raise HTTPException(status_code=400, detail=messages.UNSUPPORTED_TYPE)

    raw_bytes = _read_upload_within_limit(file, settings.MAX_UPLOAD_MB)
    if not raw_bytes:
        raise HTTPException(status_code=400, detail=messages.EMPTY_FILE)

    try:
        corrections_data = corrections_cache.get()
    except (SupabaseConnectionError, SupabaseQueryError) as exc:
        logger.error("Supabase fetch failed: %s", exc)
        raise HTTPException(status_code=503, detail=messages.DB_UNAVAILABLE) from exc

    if not corrections_data.entries:
        logger.error("Correction dictionary is empty; refusing to process uploads.")
        raise HTTPException(status_code=503, detail=messages.DB_UNAVAILABLE)

    # Skipped-word highlighting is a secondary enhancement on top of the core
    # correction pass, so a Supabase hiccup here degrades to "no highlights"
    # instead of failing the whole request — corrections still go out.
    try:
        skipped_words = skipped_words_cache.get()
    except (SupabaseConnectionError, SupabaseQueryError) as exc:
        logger.error("Supabase skipped-words fetch failed, continuing without highlighting: %s", exc)
        skipped_words = []

    def work() -> tuple[bytes, str]:
        try:
            corrected_bytes, stats = correct_docx_bytes(
                raw_bytes, corrections_data.entries, corrections_data.rules, skipped_words
            )
        except InvalidDocxError as exc:
            logger.warning("Invalid .docx upload (%s): %s", filename, exc)
            raise JobError("corrupted", str(exc)) from exc
        except CorrectionEngineError as exc:
            logger.exception("Correction engine failed on %s", filename)
            raise JobError("processing", str(exc)) from exc
        logger.info("Corrected %s: %s", filename, stats)
        return corrected_bytes, _build_output_filename(filename)

    job_id = job_store.submit(filename, work)
    return {"job_id": job_id}


@app.get("/api/correct/{job_id}")
def correction_status(job_id: str):
    job = job_store.get(job_id)
    if job is None:
        raise HTTPException(status_code=404, detail="Job not found")

    if job.status == "error":
        detail = JOB_ERROR_MESSAGES.get(job.error_kind, messages.UNEXPECTED_ERROR)
        if job.error_kind == "unexpected":
            logger.error("Unexpected job error for %s: %s", job.filename, job.error_detail)
        return {"status": "error", "detail": detail}

    return {"status": job.status}


@app.get("/api/correct/{job_id}/download")
def correction_download(job_id: str):
    job = job_store.get(job_id)
    if job is None or job.status != "done" or job.result_bytes is None:
        raise HTTPException(status_code=404, detail="Result not available")

    return StreamingResponse(
        io.BytesIO(job.result_bytes),
        media_type=DOCX_MEDIA_TYPE,
        headers={"Content-Disposition": _content_disposition(job.output_name or "corrected.docx")},
    )


class TextCorrectionRequest(BaseModel):
    text: str


@app.post("/api/correct-text")
def correct_text_endpoint(payload: TextCorrectionRequest):
    """Correct pasted text synchronously — short enough (capped at
    MAX_TEXT_CHARS) that, unlike file uploads, it doesn't need the
    background-job treatment."""
    text = payload.text or ""
    if not text.strip():
        raise HTTPException(status_code=400, detail=messages.EMPTY_TEXT)
    if len(text) > settings.MAX_TEXT_CHARS:
        raise HTTPException(status_code=400, detail=messages.TEXT_TOO_LONG)

    try:
        corrections_data = corrections_cache.get()
    except (SupabaseConnectionError, SupabaseQueryError) as exc:
        logger.error("Supabase fetch failed: %s", exc)
        raise HTTPException(status_code=503, detail=messages.DB_UNAVAILABLE) from exc

    if not corrections_data.entries:
        logger.error("Correction dictionary is empty; refusing to process text.")
        raise HTTPException(status_code=503, detail=messages.DB_UNAVAILABLE)

    try:
        skipped_words = skipped_words_cache.get()
    except (SupabaseConnectionError, SupabaseQueryError) as exc:
        logger.error("Supabase skipped-words fetch failed, continuing without highlighting: %s", exc)
        skipped_words = []

    try:
        corrected_html, corrected_text, stats = correct_text(
            text, corrections_data.entries, corrections_data.rules, skipped_words
        )
    except CorrectionEngineError as exc:
        logger.exception("Text correction engine failed")
        raise HTTPException(status_code=500, detail=messages.PROCESSING_FAILED) from exc

    logger.info("Corrected pasted text: %s", stats)
    return {"html": corrected_html, "text": corrected_text}


@app.post("/api/cache/invalidate")
def invalidate_cache(request: Request):
    if not settings.ADMIN_TOKEN:
        raise HTTPException(status_code=404)
    provided = request.headers.get("X-Admin-Token")
    if provided != settings.ADMIN_TOKEN:
        raise HTTPException(status_code=401, detail="Unauthorized")
    corrections_cache.invalidate()
    skipped_words_cache.invalidate()
    return {"status": "invalidated"}
