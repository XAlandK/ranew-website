"""
correction_engine.py
─────────────────────────
Thin wrapper around the existing corrector.py algorithm for a single
in-memory .docx upload (as opposed to corrector.py's own CLI, which walks a
folder of volumes). No correction logic is reimplemented here — the exact
same functions the CLI tool uses are imported and called in the same order,
so behavior stays identical between the two entry points.

Skipped-word highlighting (corrector.py's second action) is intentionally
not run here: the web upload flow only promises a corrected document back,
so that pass — and the harakat-highlight cleanup pass that only matters when
highlighting happened — are left out to keep large-document processing time
down.
"""

from __future__ import annotations

import io
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[2]
if str(REPO_ROOT) not in sys.path:
    sys.path.insert(0, str(REPO_ROOT))

from docx import Document  # noqa: E402

from corrector import (  # noqa: E402
    apply_corrections,
    build_replacement_rules,
    normalize_document_narrow_nbsp,
    separate_waw,
)


class InvalidDocxError(ValueError):
    """The uploaded bytes could not be opened as a .docx document."""


class CorrectionEngineError(RuntimeError):
    """The correction algorithm itself failed on an otherwise valid document."""


def correct_docx_bytes(file_bytes: bytes, dictionary_entries: list[dict[str, str]]) -> tuple[bytes, dict]:
    """Run corrector.py's correction pipeline over `file_bytes` and return
    (corrected_docx_bytes, stats)."""
    try:
        document = Document(io.BytesIO(file_bytes))
    except Exception as exc:
        raise InvalidDocxError(str(exc)) from exc

    try:
        stats = {
            "narrow_nbsp_normalized": normalize_document_narrow_nbsp(document),
            "waw_fixes_pre": separate_waw(document),
        }

        rules = build_replacement_rules(dictionary_entries)
        stats["corrections_applied"] = apply_corrections(document, rules, None, None)
        stats["waw_fixes_post"] = separate_waw(document)

        output = io.BytesIO()
        document.save(output)
        return output.getvalue(), stats
    except Exception as exc:
        raise CorrectionEngineError(str(exc)) from exc
