from fastapi import APIRouter, Depends, HTTPException, Request, Response
from fastapi.responses import RedirectResponse

from app.core.config import Settings, get_settings
from app.modules.auth.schemas import AuthStatus, CurrentUser
from app.modules.auth.service import MOCK_USER, GitHubOAuthService
from app.modules.auth.session import create_session_token, parse_session_token, sign_payload, verify_payload

router = APIRouter(prefix="/auth", tags=["auth"])


def _set_session_cookie(response: Response, user: CurrentUser, settings: Settings) -> None:
    response.set_cookie(
        settings.session_cookie_name,
        create_session_token(user, settings),
        httponly=True,
        secure=settings.session_cookie_secure,
        samesite="lax",
        max_age=60 * 60 * 24 * 7,
    )


def get_optional_user(request: Request, settings: Settings = Depends(get_settings)) -> CurrentUser | None:
    token = request.cookies.get(settings.session_cookie_name)
    if not token:
        return None
    return parse_session_token(token, settings)


def require_current_user(user: CurrentUser | None = Depends(get_optional_user)) -> CurrentUser:
    if user is None:
        raise HTTPException(status_code=401, detail="Authentication required")
    return user


@router.get("/github/login")
async def github_login(settings: Settings = Depends(get_settings)):
    if settings.use_mocks:
        response = RedirectResponse(settings.frontend_base_url)
        _set_session_cookie(response, MOCK_USER, settings)
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
    settings: Settings = Depends(get_settings),
):
    expected_state = request.cookies.get("github_oauth_state")
    if not expected_state or expected_state != state or verify_payload(state, settings.session_secret) is None:
        raise HTTPException(status_code=400, detail="Invalid OAuth state")

    user = await GitHubOAuthService(settings).exchange_code_for_user(code)
    response = RedirectResponse(settings.frontend_base_url)
    _set_session_cookie(response, user, settings)
    response.delete_cookie("github_oauth_state")
    return response


@router.get("/me", response_model=AuthStatus)
def me(user: CurrentUser | None = Depends(get_optional_user)):
    return AuthStatus(authenticated=user is not None, user=user)


@router.post("/logout", response_model=AuthStatus)
def logout(response: Response, settings: Settings = Depends(get_settings)):
    response.delete_cookie(settings.session_cookie_name)
    return AuthStatus(authenticated=False, user=None)
