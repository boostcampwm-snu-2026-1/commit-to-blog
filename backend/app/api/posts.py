from fastapi import APIRouter, Depends
from sqlmodel import Session

from app.database import get_session
from app.models import BlogPost, BlogPostCreate, BlogPostUpdate
from app.services.posts import PostRepository

router = APIRouter(prefix="/posts", tags=["posts"])


def get_post_repository(session: Session = Depends(get_session)) -> PostRepository:
    return PostRepository(session)


@router.get("", response_model=list[BlogPost])
def list_posts(posts: PostRepository = Depends(get_post_repository)):
    return posts.list()


@router.post("", response_model=BlogPost, status_code=201)
def create_post(payload: BlogPostCreate, posts: PostRepository = Depends(get_post_repository)):
    return posts.create(payload)


@router.patch("/{post_id}", response_model=BlogPost)
def update_post(post_id: int, payload: BlogPostUpdate, posts: PostRepository = Depends(get_post_repository)):
    return posts.update(post_id, payload)


@router.post("/{post_id}/publish", response_model=BlogPost)
def publish_post(post_id: int, posts: PostRepository = Depends(get_post_repository)):
    return posts.publish(post_id)
