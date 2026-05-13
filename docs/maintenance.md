# Maintenance Plan

## Commit Policy

Use feature-scoped commits:

- `docs:` project knowledge, runbooks, planning artifacts
- `refactor(backend):` backend structure with no intentional behavior change
- `refactor(frontend):` UI structure with no intentional behavior change
- `feat:` user-visible behavior
- `test:` test-only changes

Each commit should include the files needed to validate that one concern.

## Review Checklist

- Does the frontend still call only backend routes?
- Does mock mode still work without GitHub/Claude keys?
- Are API docs updated when external API syntax changes?
- Are backend route tests and frontend E2E tests aligned with UI/API contracts?
- Is generated local state ignored by git?

## Release Gates

```bash
cd backend && uv run pytest
cd frontend && npm run build
cd frontend && npx playwright test --project=chrome
docker compose config --quiet
```

## Known Tradeoffs

- PostgreSQL is the production target, while tests use SQLite for speed.
- Alembic is not yet introduced; startup currently performs additive compatibility migrations for existing `blogpost` columns. Move to Alembic before the first shared staging database.
- Mock LLM output is deterministic so E2E tests are stable.
