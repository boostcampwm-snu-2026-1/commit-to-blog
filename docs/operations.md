# Operations Runbook

## Environments

Local development uses `.env` copied from `.env.example`.

Production should provide these secrets through the deployment platform secret store:

- `DATABASE_URL`
- `GITHUB_TOKEN`
- `ANTHROPIC_API_KEY`
- `ANTHROPIC_MODEL`
- `CORS_ORIGINS`
- `USE_MOCKS=false`

## Startup

```bash
docker compose up --build
```

The backend container runs `backend/scripts/run_migrations.sh` before starting Uvicorn.

Health checks:

```bash
curl http://localhost:8000/health
curl http://localhost:8000/docs
```

## Verification

```bash
cd backend && uv run ruff check .
cd backend && uv run ruff format --check .
cd backend && uv run pytest
cd backend && uv run alembic upgrade head
cd backend && uv run sh scripts/verify_staging_migration.sh
cd frontend && npm run lint
cd frontend && npm run format:check
cd frontend && npm run typecheck
cd frontend && npm run build
cd frontend && npx playwright test --project=chrome
docker compose config --quiet
```

CI runs the same gates in `.github/workflows/ci.yml`: backend tests, staging-style PostgreSQL Alembic upgrade, frontend build, and Chrome E2E.
The `workflow_dispatch` staging migration job verifies `STAGING_DATABASE_URL` after manual approval from GitHub Actions.

## Incident Checklist

- Check `/health` before debugging frontend symptoms.
- Check `/ready` before routing traffic; it verifies database connectivity.
- Confirm `CORS_ORIGINS` includes the frontend origin. Do not use `*` because session cookies require credentialed CORS.
- Set `SESSION_COOKIE_SECURE=true` behind HTTPS and keep `SESSION_SECRET` unique per environment.
- Set `GITHUB_ALLOWED_ORGS` for company-only access and `GITHUB_ADMIN_LOGINS` for admin users.
- If GitHub calls fail, verify token scopes and the `X-GitHub-Api-Version` value in `backend/app/modules/github/service.py`.
- If Claude calls fail, verify `ANTHROPIC_API_KEY`, `ANTHROPIC_MODEL`, and request shape in `backend/app/modules/drafts/service.py`.
- If local data looks stale, remove only ignored local scratch DB files; never reset tracked files.

## Data Safety

- Do not log API keys or generated prompts containing private code unless logs are private and access-controlled.
- Keep generated drafts editable and reviewable before publication.
- Treat commit diffs as potentially sensitive source material.
