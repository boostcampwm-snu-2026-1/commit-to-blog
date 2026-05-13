from sqlalchemy import inspect, text
from sqlalchemy.engine import Engine


BLOGPOST_ADDITIVE_COLUMNS = {
    "repository_full_name": {"postgresql": "VARCHAR DEFAULT '' NOT NULL", "sqlite": "VARCHAR DEFAULT '' NOT NULL"},
    "hero_emoji": {"postgresql": "VARCHAR DEFAULT '✨' NOT NULL", "sqlite": "VARCHAR DEFAULT '✨' NOT NULL"},
    "author": {"postgresql": "VARCHAR DEFAULT 'AI Devlog' NOT NULL", "sqlite": "VARCHAR DEFAULT 'AI Devlog' NOT NULL"},
    "reading_minutes": {"postgresql": "INTEGER DEFAULT 3 NOT NULL", "sqlite": "INTEGER DEFAULT 3 NOT NULL"},
    "likes": {"postgresql": "INTEGER DEFAULT 0 NOT NULL", "sqlite": "INTEGER DEFAULT 0 NOT NULL"},
    "comments": {"postgresql": "INTEGER DEFAULT 0 NOT NULL", "sqlite": "INTEGER DEFAULT 0 NOT NULL"},
}


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
