from fastapi import APIRouter, Depends, Query

from app.core.config import Settings, get_settings
from app.modules.auth.router import require_current_user
from app.modules.auth.schemas import CurrentUser
from app.modules.github.service import GitHubService

router = APIRouter(prefix="/github", tags=["github"])


@router.get("/repositories")
async def repositories(settings: Settings = Depends(get_settings), user: CurrentUser = Depends(require_current_user)):
    return await GitHubService(settings, access_token=user.github_access_token).list_repositories()


@router.get("/branches")
async def branches(
    repository: str = Query(...),
    settings: Settings = Depends(get_settings),
    user: CurrentUser = Depends(require_current_user),
):
    return await GitHubService(settings, access_token=user.github_access_token).list_branches(repository)


@router.get("/commits")
async def commits(
    repository: str = Query(...),
    branch: str = Query(...),
    settings: Settings = Depends(get_settings),
    user: CurrentUser = Depends(require_current_user),
):
    return await GitHubService(settings, access_token=user.github_access_token).list_commits(repository, branch)
