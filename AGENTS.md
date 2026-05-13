# AGENTS.md

## Project Rules

- Start from product requirements, data contracts, component/server structure, and validation plan.
- Keep secrets out of git. Use `.env` locally and commit only `.env.example`.
- External API calls must live in backend service modules. Frontend talks only to the backend API.
- When API syntax may have changed, verify against official docs and record the source in `docs/api-integration-research.md`.
- Default development uses mocks so the core workflow can be tested without real GitHub or Claude keys.
- Keep product decisions and operational changes in `docs/product-roadmap.md` and `docs/operations.md`.

## Verification Gates

- Backend: `pytest` must pass.
- Backend API docs: FastAPI Swagger must be available at `/docs`.
- Frontend: `npm run build` must pass.
- GUI: open the frontend in Chrome and verify saved posts and create-blog screens.

## Architecture

- `frontend/`: Next.js App Router UI.
- `backend/`: FastAPI app, SQLModel models, API routers, services, tests.
- `docs/`: product, backend, frontend, API integration, and operations guides.
