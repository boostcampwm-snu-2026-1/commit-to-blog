from sqlmodel import SQLModel


class CurrentUser(SQLModel):
    id: int
    login: str
    name: str | None = None
    avatar_url: str | None = None
    github_access_token: str | None = None


class AuthStatus(SQLModel):
    authenticated: bool
    user: CurrentUser | None = None
