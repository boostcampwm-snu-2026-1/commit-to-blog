from urllib.parse import urlencode

import httpx
from fastapi import HTTPException

from app.core.config import Settings
from app.modules.auth.models import UserRole
from app.modules.auth.schemas import CurrentUser
from app.utils.http_retry import request_with_retries

MOCK_USER = CurrentUser(
    id=1,
    login="mock-octocat",
    name="Mock Octocat",
    avatar_url="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png",
    role=UserRole.admin,
    organizations=["octo"],
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
                "scope": "read:user read:org repo",
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
            organizations = await self._list_organizations(client, access_token)
            self._authorize(payload["login"], organizations)
            return CurrentUser(
                id=payload["id"],
                login=payload["login"],
                name=payload.get("name"),
                avatar_url=payload.get("avatar_url"),
                role=self._role_for_login(payload["login"]),
                organizations=organizations,
                github_access_token=access_token,
            )

    async def _list_organizations(self, client: httpx.AsyncClient, access_token: str) -> list[str]:
        response = await request_with_retries(
            client,
            "GET",
            "https://api.github.com/user/orgs",
            headers={
                "Accept": "application/vnd.github+json",
                "Authorization": f"Bearer {access_token}",
                "X-GitHub-Api-Version": "2026-03-10",
            },
        )
        response.raise_for_status()
        return [org["login"] for org in response.json()]

    def _authorize(self, login: str, organizations: list[str]) -> None:
        allowed_orgs = set(self.settings.github_allowed_org_list)
        if not allowed_orgs:
            return

        user_orgs = {org.lower() for org in organizations}
        if allowed_orgs.isdisjoint(user_orgs) and login.lower() not in self.settings.github_admin_login_list:
            raise HTTPException(status_code=403, detail="GitHub organization is not allowed")

    def _role_for_login(self, login: str) -> UserRole:
        if login.lower() in self.settings.github_admin_login_list:
            return UserRole.admin
        return UserRole.user
