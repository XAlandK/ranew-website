"""
correction_engine.py
─────────────────────────
Thin wrapper around the existing corrector.py algorithm for a single
in-memory .docx upload (as opposed to corrector.py's own CLI, which walks a
folder of volumes). No correction logic is reimplemented here — the exact
same functions the CLI tool uses are imported and called in the same order
as corrector.py's own process_volume_document, so behavior stays identical
between the two entry points:

    1. Normalize narrow NBSP
    2. Waw/comma pre-pass
    3. Apply corrections (CorrectedWords)
    4. Highlight skipped words (SkippedWords), if any were supplied
    5. Remove highlights from text containing Arabic diacritics
    6. Waw/comma final pass
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
    highlight_words_with_list,
    normalize_document_narrow_nbsp,
    remove_harakat_highlights,
    separate_waw,
)

DEFAULT_HIGHLIGHT_KEY = "YELLOW"


class InvalidDocxError(ValueError):
    """The uploaded bytes could not be opened as a .docx document."""


class CorrectionEngineError(RuntimeError):
    """The correction algorithm itself failed on an otherwise valid document."""


def correct_docx_bytes(
    file_bytes: bytes,
    dictionary_entries: list[dict[str, str]],
    rules: list[tuple],
    skipped_words: list[str] | None = None,
    highlight_key: str = DEFAULT_HIGHLIGHT_KEY,
) -> tuple[bytes, dict]:
    """Run corrector.py's correction + skipped-word-highlight pipeline over
    `file_bytes` and return (corrected_docx_bytes, stats).

    `rules` must already be the compiled output of build_replacement_rules()
    — callers are expected to build it once (e.g. cached alongside
    dictionary_entries) rather than per request; compiling ~86k regex rules
    takes several seconds and tens of MB, which is fine once but not on
    every upload.
    """
    try:
        document = Document(io.BytesIO(file_bytes))
    except Exception as exc:
        raise InvalidDocxError(str(exc)) from exc

    try:
        stats = {
            "narrow_nbsp_normalized": normalize_document_narrow_nbsp(document),
            "waw_fixes_pre": separate_waw(document),
        }

        stats["corrections_applied"] = apply_corrections(document, rules, None, None)

        if skipped_words:
            stats["skipped_highlights"] = highlight_words_with_list(
                document, highlight_key, skipped_words, dictionary_entries
            )
            stats["harakat_highlight_cleanup"] = remove_harakat_highlights(document)
        else:
            stats["skipped_highlights"] = 0
            stats["harakat_highlight_cleanup"] = 0

        stats["waw_fixes_post"] = separate_waw(document)

        output = io.BytesIO()
        document.save(output)
        return output.getvalue(), stats
    except Exception as exc:
        raise CorrectionEngineError(str(exc)) from exc
