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
