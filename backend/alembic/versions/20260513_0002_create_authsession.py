"""create authsession table

Revision ID: 20260513_0002
Revises: 20260513_0001
Create Date: 2026-05-13
"""

from collections.abc import Sequence

import sqlalchemy as sa

from alembic import op

revision: str = "20260513_0002"
down_revision: str | None = "20260513_0001"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.create_table(
        "authsession",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("session_hash", sa.String(), nullable=False),
        sa.Column("github_user_id", sa.Integer(), nullable=False),
        sa.Column("login", sa.String(), nullable=False),
        sa.Column("name", sa.String(), nullable=True),
        sa.Column("avatar_url", sa.String(), nullable=True),
        sa.Column("role", sa.String(), nullable=False),
        sa.Column("organizations", sa.String(), nullable=False),
        sa.Column("github_access_token", sa.String(), nullable=True),
        sa.Column("expires_at", sa.DateTime(), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("last_seen_at", sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_authsession_expires_at", "authsession", ["expires_at"])
    op.create_index("ix_authsession_github_user_id", "authsession", ["github_user_id"])
    op.create_index("ix_authsession_login", "authsession", ["login"])
    op.create_index("ix_authsession_role", "authsession", ["role"])
    op.create_index("ix_authsession_session_hash", "authsession", ["session_hash"], unique=True)


def downgrade() -> None:
    op.drop_index("ix_authsession_session_hash", table_name="authsession")
    op.drop_index("ix_authsession_role", table_name="authsession")
    op.drop_index("ix_authsession_login", table_name="authsession")
    op.drop_index("ix_authsession_github_user_id", table_name="authsession")
    op.drop_index("ix_authsession_expires_at", table_name="authsession")
    op.drop_table("authsession")
