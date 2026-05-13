from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session, select

from app.config import Settings, get_settings
from app.database import get_session
from app.models import BlogPost, BlogPostCreate, BlogPostUpdate, DraftRequest, DraftResponse, PostStatus
from app.services.github import GitHubService
from app.services.llm import LlmService

router = APIRouter()


@router.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@router.get("/github/repositories")
async def repositories(settings: Settings = Depends(get_settings)):
    return await GitHubService(settings).list_repositories()


@router.get("/github/branches")
async def branches(repository: str = Query(...), settings: Settings = Depends(get_settings)):
    return await GitHubService(settings).list_branches(repository)


@router.get("/github/commits")
async def commits(repository: str = Query(...), branch: str = Query(...), settings: Settings = Depends(get_settings)):
    return await GitHubService(settings).list_commits(repository, branch)


@router.post("/drafts", response_model=DraftResponse)
async def create_draft(payload: DraftRequest, settings: Settings = Depends(get_settings)):
    github = GitHubService(settings)
    selected = await github.selected_commits(payload.repository_full_name, payload.branch, payload.commit_shas)
    return await LlmService(settings).create_blog_draft(payload.repository_full_name, payload.branch, selected)


@router.get("/posts", response_model=list[BlogPost])
def list_posts(session: Session = Depends(get_session)):
    return session.exec(select(BlogPost).order_by(BlogPost.updated_at.desc())).all()


@router.post("/posts", response_model=BlogPost, status_code=201)
def create_post(payload: BlogPostCreate, session: Session = Depends(get_session)):
    post = BlogPost.model_validate(payload)
    session.add(post)
    session.commit()
    session.refresh(post)
    return post


@router.patch("/posts/{post_id}", response_model=BlogPost)
def update_post(post_id: int, payload: BlogPostUpdate, session: Session = Depends(get_session)):
    post = session.get(BlogPost, post_id)
    if post is None:
        raise HTTPException(status_code=404, detail="Post not found")
    updates = payload.model_dump(exclude_unset=True)
    for key, value in updates.items():
        setattr(post, key, value)
    post.updated_at = datetime.now(timezone.utc)
    session.add(post)
    session.commit()
    session.refresh(post)
    return post


@router.post("/posts/{post_id}/publish", response_model=BlogPost)
def publish_post(post_id: int, session: Session = Depends(get_session)):
    post = session.get(BlogPost, post_id)
    if post is None:
        raise HTTPException(status_code=404, detail="Post not found")
    post.status = PostStatus.published
    post.updated_at = datetime.now(timezone.utc)
    session.add(post)
    session.commit()
    session.refresh(post)
    return post
