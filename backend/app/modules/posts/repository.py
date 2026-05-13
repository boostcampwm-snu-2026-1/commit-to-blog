from datetime import datetime, timezone

from fastapi import HTTPException
from sqlmodel import Session, select

from app.modules.posts.constants import POST_NOT_FOUND
from app.modules.posts.models import BlogPost, PostStatus
from app.modules.posts.schemas import BlogPostCreate, BlogPostUpdate, PostAnalytics


class PostRepository:
    def __init__(self, session: Session) -> None:
        self.session = session

    def list(self, status: PostStatus | None = None, repository: str | None = None) -> list[BlogPost]:
        statement = select(BlogPost)
        if status is not None:
            statement = statement.where(BlogPost.status == status)
        if repository:
            statement = statement.where(BlogPost.repository_full_name == repository)
        return self.session.exec(statement.order_by(BlogPost.updated_at.desc())).all()

    def create(self, payload: BlogPostCreate) -> BlogPost:
        post = BlogPost.model_validate(payload)
        self.session.add(post)
        self.session.commit()
        self.session.refresh(post)
        return post

    def update(self, post_id: int, payload: BlogPostUpdate) -> BlogPost:
        post = self._get(post_id)
        updates = payload.model_dump(exclude_unset=True)
        for key, value in updates.items():
            setattr(post, key, value)
        post.updated_at = datetime.now(timezone.utc)
        return self._save(post)

    def publish(self, post_id: int) -> BlogPost:
        post = self._get(post_id)
        post.status = PostStatus.published
        post.updated_at = datetime.now(timezone.utc)
        return self._save(post)

    def like(self, post_id: int) -> BlogPost:
        post = self._get(post_id)
        post.likes += 1
        post.updated_at = datetime.now(timezone.utc)
        return self._save(post)

    def add_comment(self, post_id: int) -> BlogPost:
        post = self._get(post_id)
        post.comments += 1
        post.updated_at = datetime.now(timezone.utc)
        return self._save(post)

    def analytics(self) -> PostAnalytics:
        posts = self.session.exec(select(BlogPost)).all()
        total = len(posts)
        return PostAnalytics(
            total_posts=total,
            draft_posts=sum(1 for post in posts if post.status == PostStatus.draft),
            published_posts=sum(1 for post in posts if post.status == PostStatus.published),
            total_likes=sum(post.likes for post in posts),
            total_comments=sum(post.comments for post in posts),
            average_reading_minutes=round(sum(post.reading_minutes for post in posts) / total, 2) if total else 0,
        )

    def _get(self, post_id: int) -> BlogPost:
        post = self.session.get(BlogPost, post_id)
        if post is None:
            raise HTTPException(status_code=404, detail=POST_NOT_FOUND)
        return post

    def _save(self, post: BlogPost) -> BlogPost:
        self.session.add(post)
        self.session.commit()
        self.session.refresh(post)
        return post
