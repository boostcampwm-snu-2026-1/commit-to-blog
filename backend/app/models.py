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
    repository_full_name: str = Field(default="", index=True)
    branch: str = Field(index=True)
    summary: str
    content: str
    hero_emoji: str = "✨"
    author: str = "AI Devlog"
    reading_minutes: int = 3
    likes: int = 0
    comments: int = 0
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
    additions: int = 0
    deletions: int = 0
    changed_files: int = 0
    files: list["CommitFile"] = Field(default_factory=list)


class CommitFile(SQLModel):
    filename: str
    status: str
    additions: int = 0
    deletions: int = 0
    patch: str | None = None


class BlogPostCreate(SQLModel):
    title: str
    repository_full_name: str = ""
    branch: str
    summary: str
    content: str
    hero_emoji: str = "✨"
    author: str = "AI Devlog"
    reading_minutes: int = 3


class BlogPostUpdate(SQLModel):
    title: str | None = None
    repository_full_name: str | None = None
    branch: str | None = None
    summary: str | None = None
    content: str | None = None
    hero_emoji: str | None = None
    author: str | None = None
    reading_minutes: int | None = None
    likes: int | None = None
    comments: int | None = None
    status: PostStatus | None = None


class PostAnalytics(SQLModel):
    total_posts: int
    draft_posts: int
    published_posts: int
    total_likes: int
    total_comments: int
    average_reading_minutes: float


class DraftRequest(SQLModel):
    repository_full_name: str
    branch: str
    commit_shas: list[str]


class DraftResponse(SQLModel):
    title: str
    repository_full_name: str
    branch: str
    summary: str
    content: str
    hero_emoji: str
    author: str
    reading_minutes: int
    commit_count: int
    changed_files: int
    additions: int
    deletions: int
