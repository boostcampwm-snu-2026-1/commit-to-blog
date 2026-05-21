from datetime import datetime
from enum import StrEnum

from sqlmodel import Field, SQLModel


class UserRole(StrEnum):
    user = "user"
    admin = "admin"


class AuthSession(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    session_hash: str = Field(index=True, unique=True)
    github_user_id: int = Field(index=True)
    login: str = Field(index=True)
    name: str | None = None
    avatar_url: str | None = None
    role: UserRole = Field(default=UserRole.user, index=True)
    organizations: str = Field(default="")
    github_access_token: str | None = None
    expires_at: datetime = Field(index=True)
    created_at: datetime
    last_seen_at: datetime
