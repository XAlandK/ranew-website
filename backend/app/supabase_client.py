"""
supabase_client.py
─────────────────────────
Backend-side Supabase access: wraps the same repository classes used by the
local corrector.py CLI (repo-root supabase_repository.py) — so the
connection/query/pagination logic is not duplicated — and adds the
production behavior this service needs on top of both of them:

  * Uses the Supabase SERVICE ROLE key (never the anon key), read only from
    an environment variable (see config.py).
  * Caches each dataset (the {"wrong", "right"} correction dictionary, and
    the skipped-word list) in memory so a document upload never triggers a
    Supabase query directly.
  * Auto-refreshes each cache after CACHE_TTL_SECONDS, and exposes
    invalidate() so an admin action can force the next request to refetch
    immediately after the underlying tables are updated.

Thread-safety: FastAPI serves sync routes from a worker thread pool, so
several requests can call get_entries()/get_words() concurrently. A lock
keeps each cache's refresh-or-reuse decision atomic.
"""

from __future__ import annotations

import sys
import threading
import time
from pathlib import Path
from typing import Callable, Generic, TypeVar

# The correction engine (corrector.py) and its Supabase repository classes
# live at the repo root, one level above backend/. Reusing them directly
# keeps the correction algorithm and Supabase connection logic identical to
# the CLI tool instead of re-implementing them here.
REPO_ROOT = Path(__file__).resolve().parents[2]
if str(REPO_ROOT) not in sys.path:
    sys.path.insert(0, str(REPO_ROOT))

from corrector import normalize_narrow_nbsp  # noqa: E402
from supabase_repository import (  # noqa: E402
    CorrectionsRepository,
    SkippedWordsRepository,
    SupabaseConnectionError,
    SupabaseQueryError,
)

from .config import settings

__all__ = [
    "SupabaseConnectionError",
    "SupabaseQueryError",
    "corrections_cache",
    "skipped_words_cache",
]

T = TypeVar("T")


class TTLCache(Generic[T]):
    """Generic in-memory cache that refreshes at most once per `ttl_seconds`
    via `fetch(force_refresh=...)`, and can be force-invalidated on demand."""

    def __init__(self, fetch: Callable[[bool], T], ttl_seconds: int, empty: T):
        self._fetch = fetch
        self._ttl_seconds = ttl_seconds
        self._lock = threading.Lock()
        self._fetched_at: float = 0.0
        self._value: T = empty

    def get(self) -> T:
        with self._lock:
            now = time.monotonic()
            is_stale = self._fetched_at == 0.0 or (now - self._fetched_at) > self._ttl_seconds
            value = self._fetch(is_stale)
            if is_stale:
                self._value = value
                self._fetched_at = now
            return self._value

    def invalidate(self) -> None:
        with self._lock:
            self._fetched_at = 0.0

    def status(self) -> dict:
        with self._lock:
            return {
                "entry_count": len(self._value),
                "age_seconds": None if self._fetched_at == 0.0 else round(time.monotonic() - self._fetched_at, 1),
                "ttl_seconds": self._ttl_seconds,
            }


def _normalize_entries(raw_entries: list[dict[str, str]]) -> list[dict[str, str]]:
    entries: list[dict[str, str]] = []
    for entry in raw_entries:
        wrong = normalize_narrow_nbsp(str(entry.get("wrong") or "").strip())
        right = normalize_narrow_nbsp(str(entry.get("right") or "").strip())
        if wrong and right:
            entries.append({"wrong": wrong, "right": right})
    return entries


_corrections_repository = CorrectionsRepository(
    url=settings.SUPABASE_URL,
    key=settings.SUPABASE_SERVICE_ROLE_KEY,
)
corrections_cache: TTLCache[list[dict[str, str]]] = TTLCache(
    fetch=lambda force_refresh: _normalize_entries(
        _corrections_repository.get_dictionary_entries(force_refresh=force_refresh)
    ),
    ttl_seconds=settings.CACHE_TTL_SECONDS,
    empty=[],
)

_skipped_words_repository = SkippedWordsRepository(
    url=settings.SUPABASE_URL,
    key=settings.SUPABASE_SERVICE_ROLE_KEY,
)
skipped_words_cache: TTLCache[list[str]] = TTLCache(
    fetch=lambda force_refresh: _skipped_words_repository.get_skipped_words(force_refresh=force_refresh),
    ttl_seconds=settings.CACHE_TTL_SECONDS,
    empty=[],
)
