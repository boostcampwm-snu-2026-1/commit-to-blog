from fastapi import APIRouter, Depends, Query

from app.core.config import Settings, get_settings
from app.modules.github.service import GitHubService

router = APIRouter(prefix="/github", tags=["github"])


@router.get("/repositories")
async def repositories(settings: Settings = Depends(get_settings)):
    return await GitHubService(settings).list_repositories()


@router.get("/branches")
async def branches(repository: str = Query(...), settings: Settings = Depends(get_settings)):
    return await GitHubService(settings).list_branches(repository)


@router.get("/commits")
async def commits(repository: str = Query(...), branch: str = Query(...), settings: Settings = Depends(get_settings)):
    return await GitHubService(settings).list_commits(repository, branch)
