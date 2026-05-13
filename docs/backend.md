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
uv sync --extra test
uv run uvicorn app.main:app --reload
```

Swagger:

```text
http://localhost:8000/docs
```

## Package Layout

```text
backend/app/
  api/        HTTP route modules
  services/   external API and business workflow services
  models.py   SQLModel tables and request/response models
  database.py engine/session lifecycle
  config.py   environment settings
```

## Maintenance Rules

- Keep GitHub/Claude syntax inside `app/services/`.
- Keep route functions thin: validate request, call service/repository, return model.
- Add backend tests for every endpoint contract change.
- Default local behavior must work with `USE_MOCKS=true` and dummy keys.
- Do not commit `.env`, SQLite scratch databases, cache folders, or generated test reports.

## Validation

```bash
cd backend
uv run pytest
```

Expected result: all tests pass and `/docs` returns 200.
