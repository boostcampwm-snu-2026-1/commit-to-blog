from fastapi import APIRouter, Depends

from app.core.config import Settings, get_settings
from app.modules.auth.router import require_current_user
from app.modules.auth.schemas import CurrentUser
from app.modules.drafts.schemas import DraftRequest, DraftResponse
from app.modules.drafts.service import LlmService
from app.modules.github.service import GitHubService

router = APIRouter(prefix="/drafts", tags=["drafts"])


@router.post("", response_model=DraftResponse)
async def create_draft(
    payload: DraftRequest,
    settings: Settings = Depends(get_settings),
    user: CurrentUser = Depends(require_current_user),
):
    github = GitHubService(settings, access_token=user.github_access_token)
    selected = await github.selected_commits(payload.repository_full_name, payload.branch, payload.commit_shas)
    return await LlmService(settings).create_blog_draft(payload.repository_full_name, payload.branch, selected)
