from sqlmodel import Session, create_engine, text

from app.modules.posts.models import BlogPost
from app.utils.schema_compat import ensure_blogpost_columns


def test_init_db_adds_missing_blogpost_columns_to_legacy_schema(tmp_path) -> None:
    database_path = tmp_path / "legacy.db"
    engine = create_engine(f"sqlite:///{database_path}")

    with engine.begin() as connection:
        connection.execute(
            text(
                """
                CREATE TABLE blogpost (
                    id INTEGER PRIMARY KEY,
                    title VARCHAR NOT NULL,
                    branch VARCHAR NOT NULL,
                    summary VARCHAR NOT NULL,
                    content VARCHAR NOT NULL,
                    status VARCHAR NOT NULL,
                    created_at DATETIME NOT NULL,
                    updated_at DATETIME NOT NULL
                )
                """
            )
        )
        connection.execute(
            text(
                """
                INSERT INTO blogpost (id, title, branch, summary, content, status, created_at, updated_at)
                VALUES (1, 'Legacy', 'main', 'summary', '# body', 'draft', '2026-05-13 00:00:00', '2026-05-13 00:00:00')
                """
            )
        )

    ensure_blogpost_columns(engine)

    with Session(engine) as session:
        post = session.get(BlogPost, 1)

    assert post is not None
    assert post.repository_full_name == ""
    assert post.hero_emoji
    assert post.reading_minutes == 3
    assert post.likes == 0
    assert post.comments == 0
