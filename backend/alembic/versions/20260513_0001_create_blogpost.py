"""create blogpost table

Revision ID: 20260513_0001
Revises:
Create Date: 2026-05-13
"""

from collections.abc import Sequence

import sqlalchemy as sa

from alembic import op

revision: str = "20260513_0001"
down_revision: str | None = None
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


BLOGPOST_COLUMNS = {
    "repository_full_name": sa.Column("repository_full_name", sa.String(), nullable=False, server_default=""),
    "hero_emoji": sa.Column("hero_emoji", sa.String(), nullable=False, server_default="✨"),
    "author": sa.Column("author", sa.String(), nullable=False, server_default="AI Devlog"),
    "reading_minutes": sa.Column("reading_minutes", sa.Integer(), nullable=False, server_default="3"),
    "likes": sa.Column("likes", sa.Integer(), nullable=False, server_default="0"),
    "comments": sa.Column("comments", sa.Integer(), nullable=False, server_default="0"),
}


def upgrade() -> None:
    bind = op.get_bind()
    inspector = sa.inspect(bind)
    tables = inspector.get_table_names()

    if "blogpost" not in tables:
        op.create_table(
            "blogpost",
            sa.Column("id", sa.Integer(), nullable=False),
            sa.Column("title", sa.String(), nullable=False),
            sa.Column("repository_full_name", sa.String(), nullable=False, server_default=""),
            sa.Column("branch", sa.String(), nullable=False),
            sa.Column("summary", sa.String(), nullable=False),
            sa.Column("content", sa.String(), nullable=False),
            sa.Column("hero_emoji", sa.String(), nullable=False, server_default="✨"),
            sa.Column("author", sa.String(), nullable=False, server_default="AI Devlog"),
            sa.Column("reading_minutes", sa.Integer(), nullable=False, server_default="3"),
            sa.Column("likes", sa.Integer(), nullable=False, server_default="0"),
            sa.Column("comments", sa.Integer(), nullable=False, server_default="0"),
            sa.Column("status", sa.String(), nullable=False, server_default="draft"),
            sa.Column("created_at", sa.DateTime(), nullable=False),
            sa.Column("updated_at", sa.DateTime(), nullable=False),
            sa.PrimaryKeyConstraint("id"),
        )
        op.create_index("ix_blogpost_branch", "blogpost", ["branch"])
        op.create_index("ix_blogpost_repository_full_name", "blogpost", ["repository_full_name"])
        op.create_index("ix_blogpost_status", "blogpost", ["status"])
        return

    existing_columns = {column["name"] for column in inspector.get_columns("blogpost")}
    for name, column in BLOGPOST_COLUMNS.items():
        if name not in existing_columns:
            op.add_column("blogpost", column)


def downgrade() -> None:
    op.drop_index("ix_blogpost_status", table_name="blogpost")
    op.drop_index("ix_blogpost_repository_full_name", table_name="blogpost")
    op.drop_index("ix_blogpost_branch", table_name="blogpost")
    op.drop_table("blogpost")
