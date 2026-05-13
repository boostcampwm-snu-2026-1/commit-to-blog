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

Health checks:

```bash
curl http://localhost:8000/health
curl http://localhost:8000/docs
```

## Verification

```bash
cd backend && uv run pytest
cd frontend && npm run build
cd frontend && npx playwright test --project=chrome
docker compose config --quiet
```

## Incident Checklist

- Check `/health` before debugging frontend symptoms.
- Confirm `CORS_ORIGINS` includes the frontend origin.
- If GitHub calls fail, verify token scopes and the `X-GitHub-Api-Version` value in `backend/app/services/github.py`.
- If Claude calls fail, verify `ANTHROPIC_API_KEY`, `ANTHROPIC_MODEL`, and request shape in `backend/app/services/llm.py`.
- If local data looks stale, remove only ignored local scratch DB files; never reset tracked files.

## Data Safety

- Do not log API keys or generated prompts containing private code unless logs are private and access-controlled.
- Keep generated drafts editable and reviewable before publication.
- Treat commit diffs as potentially sensitive source material.
