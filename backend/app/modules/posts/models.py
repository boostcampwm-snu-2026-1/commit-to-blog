from datetime import datetime, timezone
from enum import StrEnum

from sqlmodel import Field, SQLModel

from app.modules.posts.constants import DEFAULT_AUTHOR, DEFAULT_HERO_EMOJI, DEFAULT_READING_MINUTES


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
    hero_emoji: str = DEFAULT_HERO_EMOJI
    author: str = DEFAULT_AUTHOR
    reading_minutes: int = DEFAULT_READING_MINUTES
    likes: int = 0
    comments: int = 0
    status: PostStatus = Field(default=PostStatus.draft, index=True)
    created_at: datetime = Field(default_factory=utc_now)
    updated_at: datetime = Field(default_factory=utc_now)
