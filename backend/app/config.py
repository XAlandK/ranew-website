"""
config.py
─────────────────────────
All backend configuration in one place, read exclusively from environment
variables. Unlike the local corrector.py CLI tool (which allows a hardcoded
development fallback for convenience), this backend is an internet-facing
service and must never fall back to a baked-in secret — SUPABASE_URL and
SUPABASE_SERVICE_ROLE_KEY are required and the app refuses to start without
them.

For local development, copy backend/.env.example to backend/.env and fill in
real values; python-dotenv loads it automatically if present. Never commit a
real .env file.
"""

from __future__ import annotations

import os

from dotenv import load_dotenv

load_dotenv()


def _require_env(name: str) -> str:
    value = os.environ.get(name)
    if not value:
        raise RuntimeError(
            f"Missing required environment variable: {name}. "
            "Set it in your deployment platform's environment settings "
            "(or in backend/.env for local development)."
        )
    return value


def _optional_env(name: str, default: str) -> str:
    return os.environ.get(name, default)


class Settings:
    # Supabase (service role key, never exposed to the browser).
    SUPABASE_URL: str = _require_env("SUPABASE_URL")
    SUPABASE_SERVICE_ROLE_KEY: str = _require_env("SUPABASE_SERVICE_ROLE_KEY")

    # How long the in-memory correction dictionary is trusted before the
    # next request triggers an automatic refresh from Supabase.
    CACHE_TTL_SECONDS: int = int(_optional_env("CACHE_TTL_SECONDS", "600"))

    # Comma-separated list of origins allowed to call this API (the deployed
    # Vercel site, plus any local dev origin you add yourself). No wildcard
    # default — CORS fails closed if this is not set.
    ALLOWED_ORIGINS: list[str] = [
        origin.strip()
        for origin in _optional_env("ALLOWED_ORIGINS", "").split(",")
        if origin.strip()
    ]

    # Reject uploads larger than this before reading them fully into memory.
    MAX_UPLOAD_MB: int = int(_optional_env("MAX_UPLOAD_MB", "20"))

    # Reject pasted-text correction requests longer than this (characters).
    # Handled synchronously (unlike file uploads), so this is kept small
    # enough to stay fast even for a paragraph with unusually long lines.
    MAX_TEXT_CHARS: int = int(_optional_env("MAX_TEXT_CHARS", "20000"))

    # Bearer token required to call POST /api/cache/invalidate. Optional:
    # if unset, the endpoint is disabled entirely rather than left open.
    ADMIN_TOKEN: str | None = os.environ.get("ADMIN_TOKEN") or None


settings = Settings()
