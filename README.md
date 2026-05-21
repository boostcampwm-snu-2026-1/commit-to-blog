# Commit to Blog

GitHub 활동 데이터를 분석해 개발 블로그 초안을 생성하고 저장/편집/발행 상태를 관리하는 서비스입니다.

## Stack

- Frontend: Next.js + TypeScript
- Backend: FastAPI + SQLModel
- Database: PostgreSQL
- External APIs: GitHub API, Anthropic Claude Messages API
- Local control: Docker Compose + `.env`

## MVP Experience

Commitgram은 인스타그램/스레드류 SNS 피드에 맞춰 개발 포스트를 보여주는 MVP입니다.

- Feed: 저장된 개발 글을 카드형 SNS 포스트로 표시
- Stories: 연결 가능한 저장소를 스토리처럼 노출
- Studio: Repository, Branch, Commit을 선택하고 AI 초안을 생성
- Composer: hero, caption, Markdown body를 편집하고 저장
- Publish: draft를 published 상태로 전환

## Quick Start

```bash
cp .env.example .env
docker compose up --build
```

- Frontend: http://localhost:3000
- Backend Swagger: http://localhost:8000/docs
- Backend health: http://localhost:8000/health

## Local Development

Backend:

```bash
cd backend
uv sync --extra test
uv run alembic upgrade head
uv run pytest
uv run uvicorn app.main:app --reload
```

Frontend:

```bash
cd frontend
npm install
npm run build
npx playwright test
npm run dev
```

## Mock Mode

`.env.example`의 기본값은 `USE_MOCKS=true`입니다. GitHub/Claude API 키가 없어도 저장소, 브랜치, 커밋, AI 블로그 초안 생성 흐름을 확인할 수 있습니다. 실제 연동 시 `USE_MOCKS=false`, `GITHUB_TOKEN`, `ANTHROPIC_API_KEY`를 설정합니다.

API 문법 조사와 적용 근거는 [API Integration Research](docs/api-integration-research.md)에 정리했습니다.

## Project Documents

- [API Integration Research](docs/api-integration-research.md)
- [Backend Guide](docs/backend.md)
- [Frontend Guide](docs/frontend.md)
- [Maintenance Plan](docs/maintenance.md)
- [Product Roadmap](docs/product-roadmap.md)
- [Operations Runbook](docs/operations.md)
- [Weekly AI Workflow Plan](docs/weekly-plan.md)
- [Service Architecture](docs/architecture.md)
- [Service Design Review](docs/design-review.md)

## AI Development Workflow

이번 주 과제의 핵심은 기능 완성보다 설계 과정을 명확히 만드는 것입니다. 작업은 다음 순서로 진행합니다.

1. 요구사항을 한 문장으로 재정의한다.
2. `rg`, `git status`, 기존 문서를 통해 FE/BE/API/DB 영향 범위를 확인한다.
3. 기능을 이슈 단위로 나누고, 각 이슈의 완료 조건과 검증 명령을 먼저 정한다.
4. `.codex/skills/service-design-review/SKILL.md`를 사용해 구현 전 설계 체크를 수행한다.
5. 구현 후 backend, frontend, E2E, migration 중 변경 범위에 맞는 gate를 실행한다.
6. PR에 완료 작업, 분석/설계 과정, 막힌 점, 새로 알게 된 점, 다음 개선점을 기록한다.

### Skill

사용 Skill은 `service-design-review`입니다. 이 Skill은 구현 전에 scope, architecture impact, verification을 먼저 작성하도록 하여 AI가 바로 코드를 수정하지 않고 설계를 통과한 뒤 작업하도록 돕습니다.

### Hook

커밋 전 품질 확인용 hook은 `.githooks/pre-commit`입니다. 활성화하면 커밋 전에 backend ruff와 frontend lint/typecheck가 실행됩니다.

```bash
git config core.hooksPath .githooks
```

## Service Architecture

- Frontend: `frontend/src/app/page.tsx`가 메인 화면을 구성하고, `features/studio`는 저장소/커밋 선택과 초안 생성을 담당하며, `features/feed`는 저장된 포스트 목록을 보여줍니다.
- API Client: `frontend/src/shared/api/client.ts`가 브라우저와 FastAPI 사이의 호출을 캡슐화하고, 세션 쿠키를 포함해 요청합니다.
- Backend Router: `backend/app/api/v1/api_router.py`가 auth, github, drafts, posts, health router를 통합합니다.
- Domain Modules: `backend/app/modules/*` 아래에서 router, schema, service, repository, model 역할을 분리합니다.
- Database: SQLModel 모델과 Alembic migration이 PostgreSQL schema를 관리합니다.
- External APIs: GitHub OAuth/GitHub REST/Claude 호출은 backend service 계층에 격리되어 있고, `USE_MOCKS=true`에서는 키 없이 mock 흐름이 동작합니다.

상세 흐름은 [Service Architecture](docs/architecture.md)에 정리했습니다.

## Production Gates

Backend:

```bash
cd backend
uv sync --extra test --group dev
uv run ruff check .
uv run ruff format --check .
uv run pytest
uv run sh scripts/verify_staging_migration.sh
```

Frontend:

```bash
cd frontend
npm ci
npm run lint
npm run format:check
npm run typecheck
npm run build
```

Use `GITHUB_ALLOWED_ORGS` for company-only GitHub SSO access and run the GitHub Actions `workflow_dispatch`
staging migration job with `STAGING_DATABASE_URL` before production rollout.
