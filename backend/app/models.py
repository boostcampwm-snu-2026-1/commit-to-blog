from datetime import datetime, timezone
from enum import StrEnum

from sqlmodel import Field, SQLModel


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


class PostStatus(StrEnum):
    draft = "draft"
    published = "published"


class BlogPost(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    title: str
    branch: str = Field(index=True)
    summary: str
    content: str
    status: PostStatus = Field(default=PostStatus.draft, index=True)
    created_at: datetime = Field(default_factory=utc_now)
    updated_at: datetime = Field(default_factory=utc_now)


class Repository(SQLModel):
    id: int
    name: str
    full_name: str
    default_branch: str


class Branch(SQLModel):
    name: str


class Commit(SQLModel):
    sha: str
    message: str
    author: str
    committed_at: datetime
    url: str


class BlogPostCreate(SQLModel):
    title: str
    branch: str
    summary: str
    content: str


class BlogPostUpdate(SQLModel):
    title: str | None = None
    branch: str | None = None
    summary: str | None = None
    content: str | None = None
    status: PostStatus | None = None


class DraftRequest(SQLModel):
    repository_full_name: str
    branch: str
    commit_shas: list[str]


class DraftResponse(SQLModel):
    title: str
    branch: str
    summary: str
    content: str
