from fastapi import APIRouter, Depends, Query
from sqlmodel import Session

from app.database import get_session
from app.models import BlogPost, BlogPostCreate, BlogPostUpdate, PostAnalytics, PostStatus
from app.services.posts import PostRepository

router = APIRouter(prefix="/posts", tags=["posts"])


def get_post_repository(session: Session = Depends(get_session)) -> PostRepository:
    return PostRepository(session)


@router.get("", response_model=list[BlogPost])
def list_posts(
    status: PostStatus | None = Query(default=None),
    repository: str | None = Query(default=None),
    posts: PostRepository = Depends(get_post_repository),
):
    return posts.list(status=status, repository=repository)


@router.get("/analytics", response_model=PostAnalytics)
def post_analytics(posts: PostRepository = Depends(get_post_repository)):
    return posts.analytics()


@router.post("", response_model=BlogPost, status_code=201)
def create_post(payload: BlogPostCreate, posts: PostRepository = Depends(get_post_repository)):
    return posts.create(payload)


@router.patch("/{post_id}", response_model=BlogPost)
def update_post(post_id: int, payload: BlogPostUpdate, posts: PostRepository = Depends(get_post_repository)):
    return posts.update(post_id, payload)


@router.post("/{post_id}/publish", response_model=BlogPost)
def publish_post(post_id: int, posts: PostRepository = Depends(get_post_repository)):
    return posts.publish(post_id)


@router.post("/{post_id}/like", response_model=BlogPost)
def like_post(post_id: int, posts: PostRepository = Depends(get_post_repository)):
    return posts.like(post_id)


@router.post("/{post_id}/comments", response_model=BlogPost)
def add_comment(post_id: int, posts: PostRepository = Depends(get_post_repository)):
    return posts.add_comment(post_id)
