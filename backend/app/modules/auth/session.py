import base64
import hashlib
import hmac
import json
from typing import Any

from app.core.config import Settings
from app.modules.auth.schemas import CurrentUser


def _b64encode(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).decode("ascii").rstrip("=")


def _b64decode(data: str) -> bytes:
    padding = "=" * (-len(data) % 4)
    return base64.urlsafe_b64decode(data + padding)


def sign_payload(payload: dict[str, Any], secret: str) -> str:
    encoded = _b64encode(json.dumps(payload, separators=(",", ":")).encode("utf-8"))
    signature = hmac.new(secret.encode("utf-8"), encoded.encode("ascii"), hashlib.sha256).digest()
    return f"{encoded}.{_b64encode(signature)}"


def verify_payload(token: str, secret: str) -> dict[str, Any] | None:
    try:
        encoded, signature = token.split(".", 1)
        expected = hmac.new(secret.encode("utf-8"), encoded.encode("ascii"), hashlib.sha256).digest()
        if not hmac.compare_digest(_b64decode(signature), expected):
            return None
        return json.loads(_b64decode(encoded))
    except (ValueError, json.JSONDecodeError):
        return None


def create_session_token(user: CurrentUser, settings: Settings) -> str:
    return sign_payload(user.model_dump(), settings.session_secret)


def parse_session_token(token: str, settings: Settings) -> CurrentUser | None:
    payload = verify_payload(token, settings.session_secret)
    if payload is None:
        return None
    return CurrentUser.model_validate(payload)
