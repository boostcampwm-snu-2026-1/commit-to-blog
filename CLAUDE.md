# CLAUDE.md

이 파일은 Claude Code가 이 레포에서 작업할 때 따라야 할 프로젝트별 지침이다.
스펙은 `docs/spec.md`, 화면 구조는 `docs/design.md`, 주차별 계획은 `plans/`에 있다.

## 프로젝트 개요

**Smart Blog (commit-to-blog)** — GitHub 커밋을 LLM으로 분석해 개발 블로그 초안을
자동 생성하고, 사용자가 편집/저장/발행할 수 있는 웹 서비스.

핵심 흐름: `Browser → React Client → Express Server → GitHub API / LLM API`.
GitHub·LLM 토큰은 Express 서버에서만 사용하며 클라이언트로 노출되지 않는다.

## 기술 스택

### Language / Runtime
- **TypeScript** (client/server 공통)
- **Node.js** 20 LTS 이상
- 패키지 매니저: **npm** (workspaces)

### Frontend (`client/`)
- **React 19** + **Vite**
- **react-router-dom**
- **TailwindCSS**
- **react-markdown** + **remark-gfm**

### Backend (`server/`)
- **Express 5** + **TypeScript**
- 개발 실행: **tsx watch**
- **@octokit/rest** — GitHub REST API 클라이언트
- **@anthropic-ai/sdk** — LLM (Claude API), 기본 모델 `claude-sonnet-4-6`
- **better-sqlite3** — 포스트 저장용 임베디드 DB
- **zod** — 요청 body 검증
- **dotenv**

### 공통
- **ESLint** + **Prettier**

## 디렉토리 구조

```
commit-to-blog/
├── client/                  # React + Vite
│   └── src/
├── server/                  # Express
│   ├── src/
│   └── data/                # sqlite 파일 (.gitignore)
├── docs/                    # spec.md, design.md
├── plans/                   # 주차별 계획
├── package.json             # npm workspaces 루트
└── CLAUDE.md
```

## 환경 변수

루트가 아닌 **`server/.env`** 에 둔다. client에는 토큰을 절대 두지 않는다.

```
PORT=3000
GITHUB_TOKEN=ghp_...          # GitHub Personal Access Token (repo 스코프)
ANTHROPIC_API_KEY=sk-ant-...  # Claude API key
DATABASE_PATH=./data/blog.db  # SQLite 파일 경로
```

- `.env`, `server/data/`는 `.gitignore`에 포함.
- 1주차에서는 단일 사용자(개발자 본인) PAT를 가정. OAuth 플로우는 범위 외.

## 제약 (spec.md 발췌)

- GitHub / LLM API 토큰은 `.env`로 관리하며 절대 git에 commit하지 않는다.
- GitHub API 호출은 반드시 **Express 서버에서** 수행한다 (CORS·토큰 노출 회피).
- 외부 블로그 플랫폼 publishing은 범위 외 — `status` 전환까지만 구현.

## Git / 워크플로우

- 메인 브랜치: `main`. 기능별 브랜치에서 작업 후 PR.
- `.github/workflows/auto-merge.yml`이 있으므로 PR 형식을 깨지 않도록 주의.
- 커밋 메시지 스타일은 `git log`로 확인 후 따른다.
