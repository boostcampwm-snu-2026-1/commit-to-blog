from urllib.parse import urlencode

import httpx

from app.core.config import Settings
from app.modules.auth.schemas import CurrentUser
from app.utils.http_retry import request_with_retries

MOCK_USER = CurrentUser(
    id=1,
    login="mock-octocat",
    name="Mock Octocat",
    avatar_url="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png",
    github_access_token="mock_github_oauth_token",
)


class GitHubOAuthService:
    def __init__(self, settings: Settings) -> None:
        self.settings = settings

    def authorization_url(self, state: str) -> str:
        params = urlencode(
            {
                "client_id": self.settings.github_oauth_client_id,
                "redirect_uri": self.settings.github_oauth_redirect_uri,
                "scope": "read:user repo",
                "state": state,
            }
        )
        return f"https://github.com/login/oauth/authorize?{params}"

    async def exchange_code_for_user(self, code: str) -> CurrentUser:
        async with httpx.AsyncClient(timeout=15) as client:
            token_response = await request_with_retries(
                client,
                "POST",
                "https://github.com/login/oauth/access_token",
                headers={"Accept": "application/json"},
                data={
                    "client_id": self.settings.github_oauth_client_id,
                    "client_secret": self.settings.github_oauth_client_secret,
                    "code": code,
                    "redirect_uri": self.settings.github_oauth_redirect_uri,
                },
            )
            token_response.raise_for_status()
            access_token = token_response.json()["access_token"]

            user_response = await request_with_retries(
                client,
                "GET",
                "https://api.github.com/user",
                headers={
                    "Accept": "application/vnd.github+json",
                    "Authorization": f"Bearer {access_token}",
                    "X-GitHub-Api-Version": "2026-03-10",
                },
            )
            user_response.raise_for_status()
            payload = user_response.json()
            return CurrentUser(
                id=payload["id"],
                login=payload["login"],
                name=payload.get("name"),
                avatar_url=payload.get("avatar_url"),
                github_access_token=access_token,
            )
