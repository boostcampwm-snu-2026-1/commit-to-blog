from datetime import datetime, timezone

from fastapi import HTTPException
from sqlmodel import Session, select

from app.models import BlogPost, BlogPostCreate, BlogPostUpdate, PostStatus


class PostRepository:
    def __init__(self, session: Session) -> None:
        self.session = session

    def list(self) -> list[BlogPost]:
        return self.session.exec(select(BlogPost).order_by(BlogPost.updated_at.desc())).all()

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

    def _get(self, post_id: int) -> BlogPost:
        post = self.session.get(BlogPost, post_id)
        if post is None:
            raise HTTPException(status_code=404, detail="Post not found")
        return post

    def _save(self, post: BlogPost) -> BlogPost:
        self.session.add(post)
        self.session.commit()
        self.session.refresh(post)
        return post
