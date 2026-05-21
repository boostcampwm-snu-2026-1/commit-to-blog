from functools import lru_cache

from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    use_mocks: bool = True
    database_url: str = "sqlite:///./commit_blog.db"
    cors_origins: str = "http://localhost:3000"
    frontend_base_url: str = "http://localhost:3000"
    session_secret: str = "dev_session_secret_change_me"
    session_cookie_name: str = "commitgram_session"
    session_cookie_secure: bool = False
    session_max_age_seconds: int = 60 * 60 * 24 * 7
    github_token: str = "dummy_github_token_for_local_mock"
    github_oauth_client_id: str = "dummy_github_oauth_client_id"
    github_oauth_client_secret: str = "dummy_github_oauth_client_secret"
    github_oauth_redirect_uri: str = "http://localhost:8000/auth/github/callback"
    github_allowed_orgs: str = ""
    github_admin_logins: str = ""
    anthropic_api_key: str = "dummy_anthropic_key_for_local_mock"
    anthropic_model: str = "claude-opus-4-7"

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    @field_validator("cors_origins")
    @classmethod
    def validate_cors_origins(cls, value: str) -> str:
        origins = [origin.strip() for origin in value.split(",") if origin.strip()]
        if "*" in origins:
            raise ValueError("CORS_ORIGINS cannot include '*' because credentialed session cookies are enabled")
        return value

    @property
    def cors_origin_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]

    @property
    def github_allowed_org_list(self) -> list[str]:
        return [org.strip().lower() for org in self.github_allowed_orgs.split(",") if org.strip()]

    @property
    def github_admin_login_list(self) -> list[str]:
        return [login.strip().lower() for login in self.github_admin_logins.split(",") if login.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()
