# 아키텍처 (Architecture)

> "React/Express 기반 디렉토리 구조 + 파일명/역할까지" — PDF 가이드 best practice.

---

## 1. 전체 아키텍처

```
┌────────┐    UI 이벤트     ┌─────────────┐   HTTP/JSON    ┌──────────────┐    GraphQL/REST    ┌────────────┐
│ Browser│ ────────────────▶│ React Client│ ──────────────▶│ Express Server│ ──────────────────▶│ GitHub API │
│        │ ◀──────────────  │ (Vite SPA)  │ ◀──────────────│   (Node 20)   │ ◀──────────────────│            │
└────────┘    렌더링         └─────────────┘   JSON 응답    └──────┬───────┘                     └────────────┘
                                                                  │
                                                                  │   chat.completions
                                                                  ▼
                                                            ┌────────────┐
                                                            │  OpenAI    │
                                                            └────────────┘
```

- 클라이언트는 **GitHub / OpenAI 토큰을 절대 보지 못함** → 서버 경유.
- 클라이언트 ↔ 서버는 같은 origin 가정 (Vite dev 시 `vite.config.ts` 의 proxy 설정).

---

## 2. 모노레포 구조

```
commit-to-blog/
├── .github/                     # 기존 (PR 템플릿, auto-merge)
├── .claude/
│   └── skills/
│       └── feature-scaffold/
│           └── SKILL.md         # 나만의 Skill
├── apps/
│   ├── client/                  # React + Vite
│   └── server/                  # Express
├── packages/
│   └── shared/                  # 공유 타입 (Post, Repo, Commit …)
├── data/
│   ├── .gitkeep
│   └── posts.json               # gitignored
├── docs/                        # 설계 문서
├── CLAUDE.md
├── README.md
├── .env.example
├── .gitignore
└── package.json                 # workspaces 루트
```

---

## 3. React (`apps/client/`)

```
apps/client/
├── index.html
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json
├── package.json
└── src/
    ├── main.tsx                 # ReactDOM root + Router + QueryClient
    ├── App.tsx                  # 레이아웃, 라우트 정의
    ├── pages/
    │   ├── SavedPostsPage.tsx   # "/"
    │   ├── CreatePostPage.tsx   # "/create"
    │   └── EditPostPage.tsx     # "/posts/:id/edit"
    ├── features/
    │   ├── repos/
    │   │   ├── RepoSearchInput.tsx
    │   │   ├── RepoSearchInput.hooks.ts   # useRepos
    │   │   └── types.ts                   # client-local 보조 타입만
    │   ├── commits/
    │   │   ├── BranchSelect.tsx
    │   │   ├── CommitCard.tsx
    │   │   └── CommitPicker.tsx
    │   ├── drafts/
    │   │   ├── AiSummaryPanel.tsx
    │   │   └── useGenerateDraft.ts
    │   └── posts/
    │       ├── PostCard.tsx
    │       ├── PostEditor.tsx
    │       └── usePosts.ts                # 목록/단건/저장 hook
    ├── components/                        # 도메인 무관 UI
    │   ├── Button.tsx
    │   ├── Card.tsx
    │   ├── Spinner.tsx
    │   ├── Tag.tsx
    │   └── ErrorBoundary.tsx
    ├── api/
    │   ├── client.ts                      # fetch wrapper (base URL + JSON)
    │   ├── repos.ts                       # listRepos, getBranches, getCommits
    │   ├── drafts.ts                      # createDraft
    │   └── posts.ts                       # CRUD + publish
    ├── lib/
    │   ├── queryClient.ts                 # React Query 설정
    │   └── formatDate.ts
    └── styles/
        └── index.css                      # @tailwind base/components/utilities
```

**역할 한 줄 요약**

| 디렉토리 | 책임 | 의존 방향 |
|---|---|---|
| `pages/` | 화면 1개 = 파일 1개. 라우트와 1:1 | `features/`, `components/` |
| `features/<domain>/` | 도메인별 UI + hook | `api/`, `components/`, `lib/` |
| `components/` | 도메인 무관 UI 부품 | `lib/` 만 |
| `api/` | 서버 호출. 응답 타입은 shared 에서 | `lib/`, `packages/shared` |
| `lib/` | 순수 유틸 | (없음) |

**원칙**: 의존성은 위에서 아래로만 흐른다. `components/` 가 `features/` 를 import 하면 안 됨.

---

## 4. Express (`apps/server/`)

```
apps/server/
├── tsconfig.json
├── package.json
└── src/
    ├── index.ts                 # 엔트리 — env 로드, app.listen
    ├── app.ts                   # Express app 구성 (미들웨어 + 라우트 등록)
    ├── config/
    │   └── env.ts               # process.env → 검증된 객체 (Zod)
    ├── routes/
    │   ├── healthz.ts           # GET /healthz
    │   ├── repos.ts             # GET /api/repos, /branches, /commits
    │   ├── drafts.ts            # POST /api/posts/draft
    │   └── posts.ts             # CRUD + publish
    ├── services/
    │   ├── github/
    │   │   ├── client.ts        # Octokit GraphQL + REST 인스턴스
    │   │   ├── listRepos.ts     # GraphQL: viewer.repositories
    │   │   ├── listBranches.ts  # GraphQL: repository.refs
    │   │   ├── listCommits.ts   # GraphQL: history
    │   │   └── getDiff.ts       # REST: compare
    │   ├── llm/
    │   │   ├── client.ts        # OpenAI 인스턴스
    │   │   ├── prompts/
    │   │   │   └── blogDraft.ts # 시스템/유저 프롬프트 템플릿
    │   │   └── createDraft.ts   # diff → 블로그 초안
    │   └── posts/
    │       ├── repository.ts    # Map + JSON 파일 동기화
    │       └── postsService.ts  # 비즈니스 로직 (생성/발행 등)
    ├── middlewares/
    │   ├── errorHandler.ts
    │   ├── notFound.ts
    │   └── requestLogger.ts
    ├── lib/
    │   ├── asyncHandler.ts      # Express 에러 forward 유틸
    │   ├── makeContextKey.ts    # Draft 캐시 키 생성
    │   └── safeJsonFile.ts      # JSON 읽기/쓰기 (atomic write)
    └── types/
        └── express.d.ts         # Request 확장
```

**역할 한 줄 요약**

| 디렉토리 | 책임 |
|---|---|
| `routes/` | HTTP 진입점. 검증 → service 호출 → 응답 |
| `services/<domain>/` | 외부 API 통신 + 도메인 로직 |
| `middlewares/` | 횡단 관심사 (로깅, 에러, 404) |
| `lib/` | 외부 의존 없는 순수 유틸 |
| `config/env.ts` | env 값을 한 곳에서 검증·노출 |

---

## 5. 공유 패키지 (`packages/shared/`)

```
packages/shared/
├── package.json   ({ "main": "src/index.ts" })
├── tsconfig.json
└── src/
    ├── index.ts
    └── types/
        ├── repo.ts
        ├── commit.ts
        ├── post.ts
        └── draft.ts
```

- 클라이언트와 서버가 **같은 객체** 를 가리키도록 보장.
- 빌드 단계 없음 — `tsconfig` `composite: true` + `references` 로 직접 소스 참조.

---

## 6. 빌드 / 실행 명령 (계획)

루트 `package.json`:

```json
{
  "scripts": {
    "dev": "concurrently -n server,client \"npm:dev -w apps/server\" \"npm:dev -w apps/client\"",
    "dev:server": "npm:dev -w apps/server",
    "dev:client": "npm:dev -w apps/client",
    "build": "npm run build -w apps/server && npm run build -w apps/client",
    "lint": "npm run lint --workspaces --if-present"
  }
}
```

`apps/server/package.json`:

```json
{ "scripts": { "dev": "tsx watch src/index.ts", "build": "tsc -p .", "start": "node dist/index.js" } }
```

`apps/client/package.json`:

```json
{ "scripts": { "dev": "vite", "build": "tsc -b && vite build", "preview": "vite preview" } }
```

---

## 7. 결정 로그

- **모노레포 vs 평탄**: 모노레포. shared types 가 핵심 동기.
- **CORS**: dev 에서는 Vite proxy 로 해결 (`/api` → `http://localhost:4000`). prod 가정은 동일 origin.
- **API prefix**: `/api/*` 통일.
- **컴포넌트 단위**: feature-first (도메인별 폴더). atomic design 까지 안 감.
- **에러 응답 포맷**: `{ error: { code: string, message: string, details?: unknown } }`.
