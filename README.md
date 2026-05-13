# Commit to Blog

GitHub 활동 데이터를 분석해 개발 블로그 초안을 생성하고 저장/편집/발행 상태를 관리하는 서비스입니다.

## Stack

- Frontend: Next.js + TypeScript
- Backend: FastAPI + SQLModel
- Database: PostgreSQL
- External APIs: GitHub API, Anthropic Claude Messages API
- Local control: Docker Compose + `.env`

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

## Mission Documents

- [1주차 계획](docs/weekly-plans/week1.md)
- [2주차 계획](docs/weekly-plans/week2.md)
- [AI Workflow](docs/ai-workflow.md)
- [Feature Log](docs/feature-log.md)
- [Custom Skill](.codex/skills/github-blog-workflow/SKILL.md)
