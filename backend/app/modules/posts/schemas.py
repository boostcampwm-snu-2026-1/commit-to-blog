from sqlmodel import SQLModel

from app.modules.posts.constants import DEFAULT_AUTHOR, DEFAULT_HERO_EMOJI, DEFAULT_READING_MINUTES
from app.modules.posts.models import PostStatus


class BlogPostCreate(SQLModel):
    title: str
    repository_full_name: str = ""
    branch: str
    summary: str
    content: str
    hero_emoji: str = DEFAULT_HERO_EMOJI
    author: str = DEFAULT_AUTHOR
    reading_minutes: int = DEFAULT_READING_MINUTES


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
