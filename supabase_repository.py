"""
supabase_repository.py
─────────────────────────
Supabase connection and data-access layer for corrector.py.

This module isolates all Supabase/PostgREST concerns (client creation,
querying, caching, error handling) from the document-correction algorithm
in corrector.py. Callers only ever see a plain list of
{"wrong": ..., "right": ...} dictionaries — the same shape corrector.py
previously loaded from corrected_words.json — so the correction algorithm
itself does not need to know where the data came from.

Environment variables (required for production deployments):
    SUPABASE_URL  - the project's REST endpoint, e.g. https://xxxx.supabase.co
    SUPABASE_KEY  - the API key (anon or service role) used to query it

For local development/testing only, _DEV_SUPABASE_URL / _DEV_SUPABASE_KEY
below are used as a fallback when those environment variables are not set.
Before deploying, set SUPABASE_URL and SUPABASE_KEY in the deployment
environment (do not rely on the hardcoded fallback in production).
"""

from __future__ import annotations

import os
import sys
from typing import Optional

try:
    from supabase import create_client, Client
except ImportError:
    print("Error: the 'supabase' package is not installed.")
    print("Install it with: pip install supabase")
    sys.exit(1)


# Development-only fallback credentials. NEVER rely on these in production —
# set the SUPABASE_URL and SUPABASE_KEY environment variables instead.
_DEV_SUPABASE_URL = "https://ocpkvqspoxbseoojhwob.supabase.co"
_DEV_SUPABASE_KEY = (
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9jcGt2cXNwb3hic2Vvb2pod29iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwNTk0NDgsImV4cCI6MjA3ODYzNTQ0OH0.QbXfD-3fufxSSdDSc__SREGeyNBokWV0WbZ6E8-WFCo"
)

CORRECTIONS_TABLE = "CorrectedWords"
WRONG_COLUMN = "incorrect_word"
RIGHT_COLUMN = "corrected_word"

# PostgREST caps each response at 1000 rows by default, and this table holds
# tens of thousands of correction records, so a single request only returns a
# small fraction of the dictionary. Page through the table with .range() until
# a page comes back short, which means the end of the table was reached.
PAGE_SIZE = 1000


class SupabaseConnectionError(RuntimeError):
    """Raised when the Supabase client cannot be created."""


class SupabaseQueryError(RuntimeError):
    """Raised when a query against Supabase fails."""


class CorrectionsRepository:
    """Fetches correction records from Supabase and caches them in memory.

    Create one instance per script run and reuse it: `get_dictionary_entries()`
    only hits the network on its first call, so processing many documents in
    one run does not re-query Supabase for each one. Pass `force_refresh=True`
    to bypass the cache if the underlying table may have changed.
    """

    def __init__(self, url: Optional[str] = None, key: Optional[str] = None):
        env_url = os.environ.get("SUPABASE_URL")
        env_key = os.environ.get("SUPABASE_KEY")

        self._url = url or env_url or _DEV_SUPABASE_URL
        self._key = key or env_key or _DEV_SUPABASE_KEY

        # Only warn when this instance will actually use the hardcoded dev
        # fallback (i.e. the caller passed no explicit url/key AND neither
        # environment variable was set) — callers such as the FastAPI
        # backend pass url/key explicitly from their own env vars and should
        # never see this warning.
        if self._url is _DEV_SUPABASE_URL or self._key is _DEV_SUPABASE_KEY:
            print(
                "Warning: SUPABASE_URL / SUPABASE_KEY environment variables are not set; "
                "falling back to hardcoded development credentials. Set these environment "
                "variables before deploying to production.",
                file=sys.stderr,
            )
        self._client: Optional[Client] = None
        self._cache: Optional[list[dict[str, str]]] = None

    def _get_client(self) -> Client:
        if self._client is None:
            try:
                self._client = create_client(self._url, self._key)
            except Exception as exc:
                raise SupabaseConnectionError(
                    f"Could not connect to Supabase at {self._url}: {exc}"
                ) from exc
        return self._client

    def get_dictionary_entries(self, force_refresh: bool = False) -> list[dict[str, str]]:
        """Return cached [{"wrong": ..., "right": ...}, ...] records, fetching once."""
        if self._cache is not None and not force_refresh:
            return self._cache

        client = self._get_client()
        all_rows: list[dict] = []
        offset = 0
        try:
            while True:
                response = (
                    client.table(CORRECTIONS_TABLE)
                    .select(f"{WRONG_COLUMN},{RIGHT_COLUMN}")
                    .range(offset, offset + PAGE_SIZE - 1)
                    .execute()
                )
                page = response.data or []
                all_rows.extend(page)
                if len(page) < PAGE_SIZE:
                    break
                offset += PAGE_SIZE
        except Exception as exc:
            raise SupabaseQueryError(
                f"Failed to query '{CORRECTIONS_TABLE}' from Supabase: {exc}"
            ) from exc

        entries: list[dict[str, str]] = []
        for row in all_rows:
            wrong = str(row.get(WRONG_COLUMN) or "").strip()
            right = str(row.get(RIGHT_COLUMN) or "").strip()
            if wrong and right:
                entries.append({"wrong": wrong, "right": right})

        self._cache = entries
        return entries
