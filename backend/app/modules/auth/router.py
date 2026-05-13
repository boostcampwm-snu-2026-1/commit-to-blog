from fastapi import APIRouter, Depends, HTTPException, Request, Response
from fastapi.responses import RedirectResponse
from sqlmodel import Session

from app.api.dependencies import get_session
from app.core.config import Settings, get_settings
from app.modules.auth.models import UserRole
from app.modules.auth.repository import AuthSessionRepository
from app.modules.auth.schemas import AuthStatus, CurrentUser
from app.modules.auth.service import MOCK_USER, GitHubOAuthService
from app.modules.auth.session import sign_payload, verify_payload

router = APIRouter(prefix="/auth", tags=["auth"])


def _set_session_cookie(response: Response, session_id: str, settings: Settings) -> None:
    response.set_cookie(
        settings.session_cookie_name,
        session_id,
        httponly=True,
        secure=settings.session_cookie_secure,
        samesite="lax",
        max_age=settings.session_max_age_seconds,
    )


def get_optional_user(
    request: Request,
    db: Session = Depends(get_session),
    settings: Settings = Depends(get_settings),
) -> CurrentUser | None:
    session_id = request.cookies.get(settings.session_cookie_name)
    if not session_id:
        return None
    return AuthSessionRepository(db).get_user(session_id)


def require_current_user(user: CurrentUser | None = Depends(get_optional_user)) -> CurrentUser:
    if user is None:
        raise HTTPException(status_code=401, detail="Authentication required")
    return user


def require_admin(user: CurrentUser = Depends(require_current_user)) -> CurrentUser:
    if user.role != UserRole.admin:
        raise HTTPException(status_code=403, detail="Admin role required")
    return user


@router.get("/github/login")
async def github_login(
    db: Session = Depends(get_session),
    settings: Settings = Depends(get_settings),
):
    if settings.use_mocks:
        response = RedirectResponse(settings.frontend_base_url)
        session_id, _ = AuthSessionRepository(db).create(MOCK_USER, settings)
        _set_session_cookie(response, session_id, settings)
        return response

    state = sign_payload({"provider": "github"}, settings.session_secret)
    response = RedirectResponse(GitHubOAuthService(settings).authorization_url(state))
    response.set_cookie(
        "github_oauth_state",
        state,
        httponly=True,
        secure=settings.session_cookie_secure,
        samesite="lax",
        max_age=600,
    )
    return response


@router.get("/github/callback")
async def github_callback(
    code: str,
    state: str,
    request: Request,
    db: Session = Depends(get_session),
    settings: Settings = Depends(get_settings),
):
    expected_state = request.cookies.get("github_oauth_state")
    if not expected_state or expected_state != state or verify_payload(state, settings.session_secret) is None:
        raise HTTPException(status_code=400, detail="Invalid OAuth state")

    user = await GitHubOAuthService(settings).exchange_code_for_user(code)
    response = RedirectResponse(settings.frontend_base_url)
    session_id, _ = AuthSessionRepository(db).create(user, settings)
    _set_session_cookie(response, session_id, settings)
    response.delete_cookie("github_oauth_state")
    return response


@router.get("/me", response_model=AuthStatus)
def me(user: CurrentUser | None = Depends(get_optional_user)):
    return AuthStatus(authenticated=user is not None, user=user)


@router.post("/logout", response_model=AuthStatus)
def logout(
    request: Request,
    response: Response,
    db: Session = Depends(get_session),
    settings: Settings = Depends(get_settings),
):
    session_id = request.cookies.get(settings.session_cookie_name)
    if session_id:
        AuthSessionRepository(db).delete(session_id)
    response.delete_cookie(settings.session_cookie_name)
    return AuthStatus(authenticated=False, user=None)
