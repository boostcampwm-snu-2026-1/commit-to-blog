from fastapi import APIRouter

from app.api import drafts, github, health, posts

api_router = APIRouter()
api_router.include_router(health.router)
api_router.include_router(github.router)
api_router.include_router(drafts.router)
api_router.include_router(posts.router)
