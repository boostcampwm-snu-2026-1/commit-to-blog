import hashlib
from datetime import UTC, datetime, timedelta
from secrets import token_urlsafe

from sqlmodel import Session, select

from app.core.config import Settings
from app.modules.auth.models import AuthSession
from app.modules.auth.schemas import CurrentUser


def hash_session_id(session_id: str) -> str:
    return hashlib.sha256(session_id.encode("utf-8")).hexdigest()


def create_session_id() -> str:
    return token_urlsafe(32)


def _as_utc(value: datetime) -> datetime:
    if value.tzinfo is None:
        return value.replace(tzinfo=UTC)
    return value.astimezone(UTC)


class AuthSessionRepository:
    def __init__(self, session: Session) -> None:
        self.session = session

    def create(self, user: CurrentUser, settings: Settings) -> tuple[str, AuthSession]:
        session_id = create_session_id()
        now = datetime.now(UTC)
        auth_session = AuthSession(
            session_hash=hash_session_id(session_id),
            github_user_id=user.id,
            login=user.login,
            name=user.name,
            avatar_url=user.avatar_url,
            role=user.role,
            organizations=",".join(user.organizations),
            github_access_token=user.github_access_token,
            expires_at=now + timedelta(seconds=settings.session_max_age_seconds),
            created_at=now,
            last_seen_at=now,
        )
        self.session.add(auth_session)
        self.session.commit()
        self.session.refresh(auth_session)
        return session_id, auth_session

    def get_user(self, session_id: str) -> CurrentUser | None:
        auth_session = self.session.exec(
            select(AuthSession).where(AuthSession.session_hash == hash_session_id(session_id))
        ).first()
        if auth_session is None or _as_utc(auth_session.expires_at) <= datetime.now(UTC):
            return None

        auth_session.last_seen_at = datetime.now(UTC)
        self.session.add(auth_session)
        self.session.commit()
        return CurrentUser(
            id=auth_session.github_user_id,
            login=auth_session.login,
            name=auth_session.name,
            avatar_url=auth_session.avatar_url,
            role=auth_session.role,
            organizations=[org for org in auth_session.organizations.split(",") if org],
            github_access_token=auth_session.github_access_token,
        )

    def delete(self, session_id: str) -> None:
        auth_session = self.session.exec(
            select(AuthSession).where(AuthSession.session_hash == hash_session_id(session_id))
        ).first()
        if auth_session is None:
            return
        self.session.delete(auth_session)
        self.session.commit()

    def delete_expired(self) -> int:
        expired = self.session.exec(select(AuthSession).where(AuthSession.expires_at <= datetime.now(UTC))).all()
        for auth_session in expired:
            self.session.delete(auth_session)
        self.session.commit()
        return len(expired)
