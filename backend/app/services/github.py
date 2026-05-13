from datetime import datetime, timezone

import httpx

from app.config import Settings
from app.models import Branch, Commit, CommitFile, Repository


MOCK_REPOSITORIES = [
    Repository(id=1, name="commit-to-blog", full_name="octo/commit-to-blog", default_branch="main"),
    Repository(id=2, name="portfolio-api", full_name="octo/portfolio-api", default_branch="develop"),
]

MOCK_BRANCHES = {
    "octo/commit-to-blog": [Branch(name="main"), Branch(name="feature/blog-draft")],
    "octo/portfolio-api": [Branch(name="develop"), Branch(name="feature/github-sync")],
}

MOCK_COMMITS = {
    "octo/commit-to-blog": [
        Commit(
            sha="a1b2c3d",
            message="Add GitHub repository selector",
            author="dev",
            committed_at=datetime(2026, 5, 10, 9, 0, tzinfo=timezone.utc),
            url="https://github.com/octo/commit-to-blog/commit/a1b2c3d",
            additions=184,
            deletions=22,
            changed_files=5,
            files=[
                CommitFile(filename="frontend/components/RepoSelector.tsx", status="added", additions=98, deletions=0),
                CommitFile(filename="backend/app/services/github.py", status="modified", additions=52, deletions=14),
            ],
        ),
        Commit(
            sha="d4e5f6a",
            message="Generate blog draft from selected commits",
            author="dev",
            committed_at=datetime(2026, 5, 11, 13, 30, tzinfo=timezone.utc),
            url="https://github.com/octo/commit-to-blog/commit/d4e5f6a",
            additions=231,
            deletions=47,
            changed_files=7,
            files=[
                CommitFile(filename="backend/app/services/llm.py", status="added", additions=110, deletions=0),
                CommitFile(filename="frontend/components/CreateBlog.tsx", status="modified", additions=78, deletions=21),
            ],
        ),
    ],
    "octo/portfolio-api": [
        Commit(
            sha="9ab8c7d",
            message="Create portfolio sync endpoint",
            author="dev",
            committed_at=datetime(2026, 5, 12, 8, 15, tzinfo=timezone.utc),
            url="https://github.com/octo/portfolio-api/commit/9ab8c7d",
            additions=76,
            deletions=8,
            changed_files=3,
            files=[CommitFile(filename="app/api/sync.py", status="added", additions=45, deletions=0)],
        )
    ],
}


class GitHubService:
    def __init__(self, settings: Settings) -> None:
        self.settings = settings
        self.headers = {
            "Accept": "application/vnd.github+json",
            "Authorization": f"Bearer {settings.github_token}",
            "X-GitHub-Api-Version": "2026-03-10",
        }

    async def list_repositories(self) -> list[Repository]:
        if self.settings.use_mocks:
            return MOCK_REPOSITORIES

        async with httpx.AsyncClient(base_url="https://api.github.com", headers=self.headers, timeout=15) as client:
            response = await client.get("/user/repos", params={"sort": "updated", "per_page": 50})
            response.raise_for_status()
            return [
                Repository(
                    id=repo["id"],
                    name=repo["name"],
                    full_name=repo["full_name"],
                    default_branch=repo["default_branch"],
                )
                for repo in response.json()
            ]

    async def list_branches(self, repository_full_name: str) -> list[Branch]:
        if self.settings.use_mocks:
            return MOCK_BRANCHES.get(repository_full_name, [Branch(name="main")])

        async with httpx.AsyncClient(base_url="https://api.github.com", headers=self.headers, timeout=15) as client:
            response = await client.get(f"/repos/{repository_full_name}/branches")
            response.raise_for_status()
            return [Branch(name=branch["name"]) for branch in response.json()]

    async def list_commits(self, repository_full_name: str, branch: str) -> list[Commit]:
        if self.settings.use_mocks:
            return MOCK_COMMITS.get(repository_full_name, [])

        async with httpx.AsyncClient(base_url="https://api.github.com", headers=self.headers, timeout=15) as client:
            response = await client.get(f"/repos/{repository_full_name}/commits", params={"sha": branch, "per_page": 20})
            response.raise_for_status()
            commits = []
            for item in response.json():
                commit = item["commit"]
                commits.append(
                    Commit(
                        sha=item["sha"],
                        message=commit["message"],
                        author=commit["author"]["name"],
                        committed_at=datetime.fromisoformat(commit["author"]["date"].replace("Z", "+00:00")),
                        url=item["html_url"],
                    )
                )
            return commits

    async def selected_commits(self, repository_full_name: str, branch: str, commit_shas: list[str]) -> list[Commit]:
        commits = await self.list_commits(repository_full_name, branch)
        selected = [commit for commit in commits if commit.sha in commit_shas]
        selected = selected or commits[:1]
        if self.settings.use_mocks:
            return selected

        async with httpx.AsyncClient(base_url="https://api.github.com", headers=self.headers, timeout=15) as client:
            detailed: list[Commit] = []
            for commit in selected:
                response = await client.get(f"/repos/{repository_full_name}/commits/{commit.sha}")
                response.raise_for_status()
                payload = response.json()
                stats = payload.get("stats", {})
                files = [
                    CommitFile(
                        filename=file["filename"],
                        status=file["status"],
                        additions=file.get("additions", 0),
                        deletions=file.get("deletions", 0),
                        patch=file.get("patch"),
                    )
                    for file in payload.get("files", [])[:12]
                ]
                detailed.append(
                    Commit(
                        sha=payload["sha"],
                        message=payload["commit"]["message"],
                        author=payload["commit"]["author"]["name"],
                        committed_at=datetime.fromisoformat(payload["commit"]["author"]["date"].replace("Z", "+00:00")),
                        url=payload["html_url"],
                        additions=stats.get("additions", 0),
                        deletions=stats.get("deletions", 0),
                        changed_files=len(payload.get("files", [])),
                        files=files,
                    )
                )
            return detailed
