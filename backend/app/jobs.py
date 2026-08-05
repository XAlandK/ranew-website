"""
jobs.py
─────────────────────────
In-memory background job tracking for document correction.

Why this exists: correcting a large real document (thousands of paragraphs)
against the full ~86k-entry dictionary can take minutes — measured at over
3 minutes locally for a 5,300-paragraph document, because long paragraphs
defeat the candidate-rule bucketing (nearly the whole dictionary ends up a
"candidate" to check). That is a property of the shared correction
algorithm itself (corrector.py, unchanged here) and applies equally to the
desktop CLI tool — it's just that a synchronous HTTP request is the wrong
shape for it: the browser's XHR timeout and the platform's own reverse-proxy
timeout kill the connection long before the work finishes. That is exactly
the "network error" this module exists to avoid: POST /api/correct now
returns a job id immediately, the real work runs in a background worker,
and the frontend polls for status instead of holding one long connection.

Concurrency is capped at 1 in-flight correction job on purpose: processing
a single large real document already peaks close to Render's Starter-plan
memory limit (measured ~400MB locally), so letting two run at once would
reproduce the out-of-memory crash this module exists to prevent.

Finished jobs are purged after JOB_TTL_SECONDS so an abandoned job's result
bytes don't sit in memory forever.
"""

from __future__ import annotations

import threading
import time
import uuid
from concurrent.futures import ThreadPoolExecutor
from dataclasses import dataclass, field
from typing import Callable, Optional

JOB_TTL_SECONDS = 30 * 60


class JobError(Exception):
    """Raised by a job's work function to attach a specific error kind
    (e.g. "corrupted") instead of falling back to a generic message."""

    def __init__(self, kind: str, message: str):
        super().__init__(message)
        self.kind = kind


@dataclass
class Job:
    id: str
    filename: str
    status: str = "processing"  # "processing" | "done" | "error"
    result_bytes: Optional[bytes] = None
    output_name: Optional[str] = None
    error_kind: str = "unexpected"
    error_detail: str = ""
    created_at: float = field(default_factory=time.monotonic)


class JobStore:
    def __init__(self):
        self._jobs: dict[str, Job] = {}
        self._lock = threading.Lock()
        # A single worker serializes correction jobs so peak memory never
        # multiplies across concurrent uploads.
        self._executor = ThreadPoolExecutor(max_workers=1)

    def submit(self, filename: str, work: Callable[[], tuple[bytes, str]]) -> str:
        job_id = uuid.uuid4().hex
        job = Job(id=job_id, filename=filename)
        with self._lock:
            self._purge_expired_locked()
            self._jobs[job_id] = job

        def run() -> None:
            try:
                result_bytes, output_name = work()
                with self._lock:
                    job.result_bytes = result_bytes
                    job.output_name = output_name
                    job.status = "done"
            except JobError as exc:
                with self._lock:
                    job.error_kind = exc.kind
                    job.error_detail = str(exc)
                    job.status = "error"
            except Exception as exc:  # noqa: BLE001 - last-resort job safety net
                with self._lock:
                    job.error_kind = "unexpected"
                    job.error_detail = str(exc)
                    job.status = "error"

        self._executor.submit(run)
        return job_id

    def get(self, job_id: str) -> Optional[Job]:
        with self._lock:
            return self._jobs.get(job_id)

    def _purge_expired_locked(self) -> None:
        now = time.monotonic()
        expired = [jid for jid, j in self._jobs.items() if now - j.created_at > JOB_TTL_SECONDS]
        for jid in expired:
            del self._jobs[jid]


job_store = JobStore()
