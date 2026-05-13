from fastapi import APIRouter, Depends, Query
from sqlmodel import Session

from app.api.dependencies import get_session
from app.modules.auth.router import require_current_user
from app.modules.auth.schemas import CurrentUser
from app.modules.posts.models import BlogPost, PostStatus
from app.modules.posts.repository import PostRepository
from app.modules.posts.schemas import BlogPostCreate, BlogPostUpdate, PostAnalytics

router = APIRouter(prefix="/posts", tags=["posts"])


def get_post_repository(session: Session = Depends(get_session)) -> PostRepository:
    return PostRepository(session)


@router.get("", response_model=list[BlogPost])
def list_posts(
    status: PostStatus | None = Query(default=None),
    repository: str | None = Query(default=None),
    posts: PostRepository = Depends(get_post_repository),
    user: CurrentUser = Depends(require_current_user),
):
    return posts.list(status=status, repository=repository)


@router.get("/analytics", response_model=PostAnalytics)
def post_analytics(posts: PostRepository = Depends(get_post_repository), user: CurrentUser = Depends(require_current_user)):
    return posts.analytics()


@router.post("", response_model=BlogPost, status_code=201)
def create_post(
    payload: BlogPostCreate,
    posts: PostRepository = Depends(get_post_repository),
    user: CurrentUser = Depends(require_current_user),
):
    return posts.create(payload)


@router.patch("/{post_id}", response_model=BlogPost)
def update_post(
    post_id: int,
    payload: BlogPostUpdate,
    posts: PostRepository = Depends(get_post_repository),
    user: CurrentUser = Depends(require_current_user),
):
    return posts.update(post_id, payload)


@router.post("/{post_id}/publish", response_model=BlogPost)
def publish_post(post_id: int, posts: PostRepository = Depends(get_post_repository), user: CurrentUser = Depends(require_current_user)):
    return posts.publish(post_id)


@router.post("/{post_id}/like", response_model=BlogPost)
def like_post(post_id: int, posts: PostRepository = Depends(get_post_repository), user: CurrentUser = Depends(require_current_user)):
    return posts.like(post_id)


@router.post("/{post_id}/comments", response_model=BlogPost)
def add_comment(post_id: int, posts: PostRepository = Depends(get_post_repository), user: CurrentUser = Depends(require_current_user)):
    return posts.add_comment(post_id)
