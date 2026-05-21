import asyncio
import time
from collections.abc import Awaitable, Callable
from typing import TypeVar

import httpx

T = TypeVar("T")

RETRY_STATUS_CODES = {429, 500, 502, 503, 504, 529}


def retry_delay_seconds(response: httpx.Response | None, attempt: int) -> float:
    if response is not None:
        retry_after = response.headers.get("retry-after")
        if retry_after:
            try:
                return min(float(retry_after), 60)
            except ValueError:
                pass

        reset = response.headers.get("x-ratelimit-reset")
        remaining = response.headers.get("x-ratelimit-remaining")
        if remaining == "0" and reset:
            try:
                return min(max(int(reset) - int(time.time()), 0), 60)
            except ValueError:
                pass

    return min(2**attempt, 30)


def should_retry_status(status_code: int) -> bool:
    return status_code in RETRY_STATUS_CODES or status_code == 403


async def request_with_retries(
    client: httpx.AsyncClient,
    method: str,
    url: str,
    *,
    max_attempts: int = 3,
    **kwargs,
) -> httpx.Response:
    last_response: httpx.Response | None = None
    for attempt in range(max_attempts):
        response = await client.request(method, url, **kwargs)
        if not should_retry_status(response.status_code):
            return response
        last_response = response
        if attempt == max_attempts - 1:
            return response
        await asyncio.sleep(retry_delay_seconds(response, attempt))
    return last_response  # type: ignore[return-value]


async def call_with_retries(operation: Callable[[], Awaitable[T]], *, max_attempts: int = 3) -> T:
    last_error: Exception | None = None
    for attempt in range(max_attempts):
        try:
            return await operation()
        except Exception as exc:
            last_error = exc
            status_code = getattr(exc, "status_code", None)
            if status_code not in RETRY_STATUS_CODES or attempt == max_attempts - 1:
                raise
            response = getattr(exc, "response", None)
            await asyncio.sleep(retry_delay_seconds(response, attempt))
    raise last_error  # type: ignore[misc]
