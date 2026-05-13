from collections.abc import Generator

from sqlalchemy import inspect, text
from sqlalchemy.engine import Engine
from sqlmodel import Session, SQLModel, create_engine

from app.config import get_settings


def _connect_args(database_url: str) -> dict[str, bool]:
    if database_url.startswith("sqlite"):
        return {"check_same_thread": False}
    return {}


settings = get_settings()
engine = create_engine(settings.database_url, echo=False, connect_args=_connect_args(settings.database_url))


BLOGPOST_ADDITIVE_COLUMNS = {
    "repository_full_name": {"postgresql": "VARCHAR DEFAULT '' NOT NULL", "sqlite": "VARCHAR DEFAULT '' NOT NULL"},
    "hero_emoji": {"postgresql": "VARCHAR DEFAULT '✨' NOT NULL", "sqlite": "VARCHAR DEFAULT '✨' NOT NULL"},
    "author": {"postgresql": "VARCHAR DEFAULT 'AI Devlog' NOT NULL", "sqlite": "VARCHAR DEFAULT 'AI Devlog' NOT NULL"},
    "reading_minutes": {"postgresql": "INTEGER DEFAULT 3 NOT NULL", "sqlite": "INTEGER DEFAULT 3 NOT NULL"},
    "likes": {"postgresql": "INTEGER DEFAULT 0 NOT NULL", "sqlite": "INTEGER DEFAULT 0 NOT NULL"},
    "comments": {"postgresql": "INTEGER DEFAULT 0 NOT NULL", "sqlite": "INTEGER DEFAULT 0 NOT NULL"},
}


def init_db(target_engine: Engine | None = None) -> None:
    active_engine = target_engine or engine
    SQLModel.metadata.create_all(active_engine)
    ensure_blogpost_columns(active_engine)


def ensure_blogpost_columns(target_engine: Engine) -> None:
    inspector = inspect(target_engine)
    if "blogpost" not in inspector.get_table_names():
        return

    existing_columns = {column["name"] for column in inspector.get_columns("blogpost")}
    dialect = "postgresql" if target_engine.dialect.name == "postgresql" else "sqlite"
    missing_columns = [
        (name, definitions[dialect])
        for name, definitions in BLOGPOST_ADDITIVE_COLUMNS.items()
        if name not in existing_columns
    ]
    if not missing_columns:
        return

    with target_engine.begin() as connection:
        for name, definition in missing_columns:
            connection.execute(text(f"ALTER TABLE blogpost ADD COLUMN {name} {definition}"))


def get_session() -> Generator[Session, None, None]:
    with Session(engine) as session:
        yield session
