import time

import httpx

from app.utils.http_retry import retry_delay_seconds, should_retry_status


def test_retry_delay_uses_retry_after_header() -> None:
    response = httpx.Response(429, headers={"retry-after": "3"})
    assert retry_delay_seconds(response, attempt=0) == 3


def test_retry_delay_uses_github_rate_limit_reset() -> None:
    response = httpx.Response(
        403,
        headers={"x-ratelimit-remaining": "0", "x-ratelimit-reset": str(int(time.time()) + 5)},
    )
    assert 0 <= retry_delay_seconds(response, attempt=0) <= 5


def test_retryable_status_codes_include_rate_limit_and_server_errors() -> None:
    assert should_retry_status(429)
    assert should_retry_status(529)
    assert should_retry_status(500)
    assert not should_retry_status(404)
