from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    use_mocks: bool = True
    database_url: str = "sqlite:///./commit_blog.db"
    cors_origins: str = "http://localhost:3000"
    github_token: str = "dummy_github_token_for_local_mock"
    anthropic_api_key: str = "dummy_anthropic_key_for_local_mock"
    anthropic_model: str = "claude-3-5-sonnet-20241022"

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    @property
    def cors_origin_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()
