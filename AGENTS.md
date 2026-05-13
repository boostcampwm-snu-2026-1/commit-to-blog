# AGENTS.md

## Project Rules

- Start from planning artifacts before implementation: weekly plan, feature list, data model, component/server structure, and validation plan.
- Keep secrets out of git. Use `.env` locally and commit only `.env.example`.
- External API calls must live in backend service modules. Frontend talks only to the backend API.
- Default development uses mocks so the core workflow can be tested without real GitHub or Claude keys.
- Record feature-list numbers and confirmed behavior in `docs/feature-log.md` as commits or work chunks are completed.

## Verification Gates

- Backend: `pytest` must pass.
- Backend API docs: FastAPI Swagger must be available at `/docs`.
- Frontend: `npm run build` must pass.
- GUI: open the frontend in Chrome and verify saved posts and create-blog screens.

## Architecture

- `frontend/`: Next.js App Router UI.
- `backend/`: FastAPI app, SQLModel models, API routers, services, tests.
- `docs/weekly-plans/`: week-by-week mission plans.
- `.codex/skills/github-blog-workflow/`: custom workflow skill extracted from this project.
