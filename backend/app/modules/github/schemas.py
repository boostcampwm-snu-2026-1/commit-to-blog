from datetime import datetime

from sqlmodel import Field, SQLModel


class Repository(SQLModel):
    id: int
    name: str
    full_name: str
    default_branch: str


class Branch(SQLModel):
    name: str


class CommitFile(SQLModel):
    filename: str
    status: str
    additions: int = 0
    deletions: int = 0
    patch: str | None = None


class Commit(SQLModel):
    sha: str
    message: str
    author: str
    committed_at: datetime
    url: str
    additions: int = 0
    deletions: int = 0
    changed_files: int = 0
    files: list[CommitFile] = Field(default_factory=list)
