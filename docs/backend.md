# Backend Guide

## Responsibilities

FastAPI backend is the only layer that talks to external APIs and the database.

- GitHub API integration: repository, branch, commit list, commit detail
- Claude Messages API integration: draft generation from selected commits
- Persistence: saved blog posts through SQLModel
- Contract: frontend receives normalized JSON only

## Runtime

```bash
cd backend
uv sync --extra test --group dev
uv run uvicorn app.main:app --reload
```

Swagger:

```text
http://localhost:8000/docs
```

## Package Layout

```text
backend/app/
  core/       configuration, logging, security helpers
  db/         engine/session lifecycle
  api/v1/     versioned API router hub
  modules/    domain modules with router/model/schema/service/repository files
  utils/      shared utilities
```

## Maintenance Rules

- Keep GitHub/Claude syntax inside `app/modules/github/service.py` and `app/modules/drafts/service.py`.
- Keep route functions thin: validate request, call service/repository, return model.
- Add backend tests for every endpoint contract change.
- Default local behavior must work with `USE_MOCKS=true` and dummy keys.
- GitHub SSO must use server-side `AuthSession` rows; the browser cookie stores only an opaque session id.
- Restrict company access with `GITHUB_ALLOWED_ORGS` and promote maintainers with `GITHUB_ADMIN_LOGINS`.
- Do not commit `.env`, SQLite scratch databases, cache folders, or generated test reports.

## Validation

```bash
cd backend
uv run ruff check .
uv run ruff format --check .
uv run alembic upgrade head
uv run pytest
```

Expected result: lint, formatting, migrations, tests pass and `/docs` returns 200.
