from sqlmodel import SQLModel


class DraftRequest(SQLModel):
    repository_full_name: str
    branch: str
    commit_shas: list[str]


class DraftResponse(SQLModel):
    title: str
    repository_full_name: str
    branch: str
    summary: str
    content: str
    hero_emoji: str
    author: str
    reading_minutes: int
    commit_count: int
    changed_files: int
    additions: int
    deletions: int
