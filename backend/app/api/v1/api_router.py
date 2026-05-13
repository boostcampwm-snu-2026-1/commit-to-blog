from fastapi import APIRouter

from app.modules.drafts.router import router as drafts_router
from app.modules.github.router import router as github_router
from app.modules.health.router import router as health_router
from app.modules.posts.router import router as posts_router

api_router = APIRouter()
api_router.include_router(health_router)
api_router.include_router(github_router)
api_router.include_router(drafts_router)
api_router.include_router(posts_router)
