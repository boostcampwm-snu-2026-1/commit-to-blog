# Smart Blog (commit-to-blog)

> GitHub 활동을 LLM 으로 분석해 개발 블로그 초안을 자동 생성하는 서비스.
> 서울대 "AI를 활용한 실무 front-end 개발(2026)" 11–12주차 과제.

---

## 한 줄 정의

> 사용자의 GitHub 커밋을 LLM 이 사람 친화적인 블로그 글로 바꿔주고, 사용자가 직접 다듬어 발행할 수 있는 서비스.

## 화면 (계획)

1. **저장된 포스트** (`/`) — 카드형 목록, 브랜치 태그·요약·날짜.
2. **블로그 생성** (`/create`) — 저장소 → 브랜치 → 커밋 → AI 요약 → 편집기.
3. **포스트 수정** (`/posts/:id/edit`) — 다시 편집 / 발행.

## 아키텍처

```
Browser  →  React Client (Vite, SPA)  →  Express Server  →  GitHub API (Octokit)
                                                       └→  OpenAI API
```

자세한 디렉토리·파일 구조는 [`docs/architecture.md`](docs/architecture.md).

## 기술 스택

| 영역 | 선택 |
|---|---|
| 모노레포 | npm workspaces (`apps/client`, `apps/server`, `packages/shared`) |
| 프론트엔드 | React 18 + Vite + TypeScript + Tailwind CSS |
| 클라이언트 상태 | React Query + `useState` |
| 라우팅 | React Router v6 |
| 백엔드 | Express + TypeScript |
| GitHub | Octokit GraphQL (주) + REST (보조) |
| LLM | OpenAI Chat Completions (`gpt-4o-mini`) |
| 검증 | Zod |
| 영속화 | JSON 파일 (`data/posts.json`) |

선택 근거는 [`docs/tech-stack.md`](docs/tech-stack.md).

## 실행

### 사전 준비

```bash
cp .env.example .env
# .env 를 열어 GITHUB_TOKEN, OPENAI_API_KEY 채우기 (없으면 mock 데이터로 동작)
npm install
```

### 개발 서버

```bash
# 동시에 (Express + Vite)
npm run dev

# 개별
npm run dev:server    # http://localhost:4000
npm run dev:client    # http://localhost:5173
```

Vite dev server 는 `/api/*` 와 `/healthz` 를 Express(`:4000`) 로 프록시한다.

### 빌드 / 검증

```bash
npm run typecheck            # 모든 workspace 타입 검사
npm run build -w apps/client # 프론트엔드 production 빌드
```

### 스모크 테스트

```bash
curl http://localhost:4000/healthz
curl http://localhost:4000/api/repos
curl 'http://localhost:4000/api/repos?q=commit'
```

전체 시나리오는 [`docs/test-plan.md`](docs/test-plan.md).

## 문서

| 분류 | 파일 |
|---|---|
| 주차 계획 | [`docs/plan-week11.md`](docs/plan-week11.md), [`docs/plan-week12.md`](docs/plan-week12.md) |
| 요구 · 범위 | [`docs/requirements.md`](docs/requirements.md), [`docs/user-flow.md`](docs/user-flow.md), [`docs/scope.md`](docs/scope.md) |
| 설계 | [`docs/tech-stack.md`](docs/tech-stack.md), [`docs/data-model.md`](docs/data-model.md), [`docs/architecture.md`](docs/architecture.md), [`docs/state-flow.md`](docs/state-flow.md), [`docs/api-spec.md`](docs/api-spec.md) |
| AI · 검증 | [`docs/ai-workflow.md`](docs/ai-workflow.md), [`docs/test-plan.md`](docs/test-plan.md), [`docs/checklist.md`](docs/checklist.md) |
| 프로젝트 가이드 | [`CLAUDE.md`](CLAUDE.md), [`.claude/skills/feature-scaffold/SKILL.md`](.claude/skills/feature-scaffold/SKILL.md) |

## 진행 상태

- **11주차** — ✅ 기획·설계·프로토타입 완료. `feature/week11` 브랜치 Draft PR.
- **12주차** — ⏳ 진행 예정. 우선순위는 [`docs/plan-week12.md`](docs/plan-week12.md).

## 라이선스 / 저작권

학습 목적 과제 저장소.
