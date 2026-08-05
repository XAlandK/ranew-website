"""
supabase_client.py
─────────────────────────
Backend-side Supabase access: wraps the same CorrectionsRepository used by
the local corrector.py CLI (repo-root supabase_repository.py) — so the
connection/query/pagination logic is not duplicated — and adds the
production behavior this service needs on top of it:

  * Uses the Supabase SERVICE ROLE key (never the anon key), read only from
    an environment variable (see config.py).
  * Caches the normalized {"wrong", "right"} dictionary in memory so a
    document upload never triggers a Supabase query directly.
  * Auto-refreshes that cache after CACHE_TTL_SECONDS, and exposes
    invalidate() so an admin action can force the next request to refetch
    immediately after the CorrectedWords table is updated.

Thread-safety: FastAPI serves sync routes from a worker thread pool, so
several requests can call get_entries() concurrently. A lock keeps the
refresh-or-reuse decision atomic.
"""

from __future__ import annotations

import sys
import threading
import time
from pathlib import Path

# The correction engine (corrector.py) and its Supabase repository class
# live at the repo root, one level above backend/. Reusing them directly
# keeps the correction algorithm and Supabase connection logic identical to
# the CLI tool instead of re-implementing them here.
REPO_ROOT = Path(__file__).resolve().parents[2]
if str(REPO_ROOT) not in sys.path:
    sys.path.insert(0, str(REPO_ROOT))

from corrector import normalize_narrow_nbsp  # noqa: E402
from supabase_repository import (  # noqa: E402
    CorrectionsRepository,
    SupabaseConnectionError,
    SupabaseQueryError,
)

from .config import settings

__all__ = [
    "SupabaseConnectionError",
    "SupabaseQueryError",
    "corrections_cache",
]


def _normalize_entries(raw_entries: list[dict[str, str]]) -> list[dict[str, str]]:
    entries: list[dict[str, str]] = []
    for entry in raw_entries:
        wrong = normalize_narrow_nbsp(str(entry.get("wrong") or "").strip())
        right = normalize_narrow_nbsp(str(entry.get("right") or "").strip())
        if wrong and right:
            entries.append({"wrong": wrong, "right": right})
    return entries


class TTLCorrectionsCache:
    """In-memory correction dictionary that refreshes itself at most once
    per `ttl_seconds`, and can be force-invalidated on demand."""

    def __init__(self, repository: CorrectionsRepository, ttl_seconds: int):
        self._repository = repository
        self._ttl_seconds = ttl_seconds
        self._lock = threading.Lock()
        self._fetched_at: float = 0.0
        self._entries: list[dict[str, str]] = []

    def get_entries(self) -> list[dict[str, str]]:
        with self._lock:
            now = time.monotonic()
            is_stale = self._fetched_at == 0.0 or (now - self._fetched_at) > self._ttl_seconds
            raw = self._repository.get_dictionary_entries(force_refresh=is_stale)
            if is_stale:
                self._entries = _normalize_entries(raw)
                self._fetched_at = now
            return self._entries

    def invalidate(self) -> None:
        with self._lock:
            self._fetched_at = 0.0

    def status(self) -> dict:
        with self._lock:
            return {
                "entry_count": len(self._entries),
                "age_seconds": None if self._fetched_at == 0.0 else round(time.monotonic() - self._fetched_at, 1),
                "ttl_seconds": self._ttl_seconds,
            }


_repository = CorrectionsRepository(
    url=settings.SUPABASE_URL,
    key=settings.SUPABASE_SERVICE_ROLE_KEY,
)
corrections_cache = TTLCorrectionsCache(_repository, settings.CACHE_TTL_SECONDS)
