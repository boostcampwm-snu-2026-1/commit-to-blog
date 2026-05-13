from sqlmodel import Field, SQLModel

from app.modules.auth.models import UserRole


class CurrentUser(SQLModel):
    id: int
    login: str
    name: str | None = None
    avatar_url: str | None = None
    role: UserRole = UserRole.user
    organizations: list[str] = Field(default_factory=list)
    github_access_token: str | None = None


class AuthStatus(SQLModel):
    authenticated: bool
    user: CurrentUser | None = None
