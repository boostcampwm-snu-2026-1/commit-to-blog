from collections.abc import Generator

import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session, SQLModel, create_engine
from sqlmodel.pool import StaticPool

from app.core.config import get_settings
from app.db.session import get_session
from app.main import app


@pytest.fixture(name="client")
def client_fixture() -> Generator[TestClient, None, None]:
    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    SQLModel.metadata.create_all(engine)

    def get_test_session() -> Generator[Session, None, None]:
        with Session(engine) as session:
            yield session

    app.dependency_overrides[get_session] = get_test_session
    get_settings.cache_clear()
    with TestClient(app) as client:
        yield client
    app.dependency_overrides.clear()


def test_health_and_swagger(client: TestClient) -> None:
    assert client.get("/health").json() == {"status": "ok"}
    docs = client.get("/docs")
    assert docs.status_code == 200
    assert "swagger" in docs.text.lower()


def test_github_mock_flow_and_draft_generation(client: TestClient) -> None:
    repos = client.get("/github/repositories").json()
    assert repos[0]["full_name"] == "octo/commit-to-blog"

    branches = client.get("/github/branches", params={"repository": repos[0]["full_name"]}).json()
    assert branches[0]["name"] == "main"

    commits = client.get(
        "/github/commits",
        params={"repository": repos[0]["full_name"], "branch": branches[0]["name"]},
    ).json()
    assert commits

    draft = client.post(
        "/drafts",
        json={
            "repository_full_name": repos[0]["full_name"],
            "branch": branches[0]["name"],
            "commit_shas": [commits[0]["sha"]],
        },
    ).json()
    assert draft["title"]
    assert draft["repository_full_name"] == repos[0]["full_name"]
    assert draft["changed_files"] > 0
    assert draft["additions"] > 0
    assert "커밋 하이라이트" in draft["content"]


def test_post_create_update_publish(client: TestClient) -> None:
    created = client.post(
        "/posts",
        json={
            "title": "테스트 포스트",
            "repository_full_name": "octo/commit-to-blog",
            "branch": "main",
            "summary": "요약",
            "content": "# 본문",
            "hero_emoji": "🚀",
            "author": "Claude Mock",
            "reading_minutes": 2,
        },
    )
    assert created.status_code == 201
    post = created.json()

    updated = client.patch(f"/posts/{post['id']}", json={"summary": "수정 요약"}).json()
    assert updated["summary"] == "수정 요약"
    assert updated["repository_full_name"] == "octo/commit-to-blog"

    published = client.post(f"/posts/{post['id']}/publish").json()
    assert published["status"] == "published"

    liked = client.post(f"/posts/{post['id']}/like").json()
    assert liked["likes"] == 1

    commented = client.post(f"/posts/{post['id']}/comments").json()
    assert commented["comments"] == 1

    posts = client.get("/posts").json()
    assert len(posts) == 1

    published_posts = client.get("/posts", params={"status": "published"}).json()
    assert len(published_posts) == 1

    analytics = client.get("/posts/analytics").json()
    assert analytics["total_posts"] == 1
    assert analytics["published_posts"] == 1
    assert analytics["total_likes"] == 1
    assert analytics["total_comments"] == 1
