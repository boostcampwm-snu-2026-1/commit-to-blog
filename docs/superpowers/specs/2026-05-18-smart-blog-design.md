# Smart Blog — Design Spec

- **작성일:** 2026-05-18
- **과제 범위:** 2주
- **목표:** GitHub 활동 데이터를 분석해 자동으로 개발 블로그 초안을 생성하는 서비스 ("Smart Blog")
- **이 문서의 역할:** 모든 개발 작업의 단일 기준 문서. 다음 commit은 항상 이 문서의 체크리스트를 참고해 결정한다.

---

## 1. 결정 사항 요약

| 항목 | 결정 | 근거 |
|---|---|---|
| 언어 | TypeScript | 과제 요구. 타입 안정성. |
| 클라이언트 | React + Vite | 가벼운 dev server, 빠른 HMR, 아키텍처 다이어그램의 React Client와 일치 |
| 서버 | Express (Node, TS) | 과제 요구 ("GitHub API 요청은 Express 기반의 서버환경에서 요청") |
| 스타일링 | Tailwind CSS | 흑백 톤·여백 중심 목업을 최단 시간으로 재현 가능 |
| LLM | Anthropic Claude API | 요약 품질 우수. provider 교체 가능하도록 service 레이어로 분리 |
| GitHub 인증 | `.env`의 PAT 1개 | 단일 사용자(과제 제출자 본인) 전제. 로그인 UI 불필요 |
| 드래프트 저장 | 서버 메모리 (`Map<string, Draft>`) | 과제 스펙의 "memory? DB?" 가이드 중 가장 단순. 재시작 시 소실 허용. |
| 발행 동작 | 사용자 GitHub repo에 `posts/YYYY-MM-DD-{slug}.md` push | 외부 블로그 플랫폼 연동보다 비용이 작고 GitHub PAT 인증을 재활용 |
| 개발 전략 | 수직 슬라이스 우선 | 1주차 끝에 동작하는 얇은 end-to-end 확보. 시연 리스크 최소화 |

---

## 2. 스코프

### 2.1 포함 (MVP)
- 저장소 목록 조회 (사용자 본인의 GitHub repo)
- 브랜치 선택 + 최근 커밋 N개 (기본 20) 조회
- 커밋 1건 선택 → Claude로 블로그 초안(제목·요약·본문) 생성
- 초안 수정 가능한 텍스트 편집기 (단순 textarea)
- 드래프트를 "저장된 포스트"로 보관 (서버 메모리)
- 카드형 목록 (브랜치 태그, 요약 프리뷰, 날짜)
- 드래프트 다시 편집 ("수정하기")
- 발행하기 → 사용자의 GitHub repo `posts/YYYY-MM-DD-{slug}.md` 경로로 push
- 드래프트 삭제

### 2.2 제외 (YAGNI)
- 다중 커밋 동시 요약 (1차에선 1커밋만)
- 이미지 자동 생성 (카드 썸네일은 placeholder)
- 검색/필터/페이지네이션
- 다중 사용자, 로그인, 권한
- 영구 DB
- 외부 블로그 플랫폼(Tistory/Medium) 연동
- 다국어 (한국어만)

---

## 3. 데이터 모델

`shared/types.ts`에 정의되어 client / server 양쪽에서 import.

```ts
export type RepoSummary = {
  name: string;          // "owner/repo"
  defaultBranch: string;
};

export type CommitSummary = {
  sha: string;           // 표시는 앞 7글자
  message: string;       // 1st line
  author: string;        // login
  date: string;          // ISO8601
};

export type CommitDetail = CommitSummary & {
  body: string;          // 커밋 메시지 본문
  diffSummary: string;   // files + additions/deletions (LLM 입력용 압축본)
};

export type DraftStatus = 'draft' | 'published';

export type Draft = {
  id: string;            // uuid
  repo: string;          // "owner/repo"
  branch: string;        // "main"
  commitSha: string;
  title: string;         // LLM 생성, 사용자 수정 가능
  summary: string;       // 카드 프리뷰용 (1-2줄)
  body: string;          // markdown 본문
  status: DraftStatus;
  createdAt: string;
  updatedAt: string;
  publishedUrl?: string; // 발행 후 GitHub 파일 URL
};

export type ApiResult<T> =
  | { data: T; error?: never }
  | { data?: never; error: { code: string; message: string } };
```

서버 메모리 보관소: `Map<Draft['id'], Draft>`.

---

## 4. 디렉토리 / 컴포넌트 구조

### 4.1 리포 레이아웃

```
commit-to-blog/
├── client/                      # Vite + React + TS
├── server/                      # Express + TS
├── shared/                      # 공용 타입
│   └── types.ts
├── docs/
│   ├── superpowers/specs/       # 디자인 문서 (이 문서 포함)
│   ├── week1-plan.md            # 주차별 계획 (과제 요구)
│   └── week2-plan.md
├── .env                         # GITHUB_TOKEN, ANTHROPIC_API_KEY (gitignore)
├── .env.example                 # 키 이름만
├── package.json                 # npm workspaces 루트
└── README.md
```

루트 `package.json`에 `workspaces: ["client", "server", "shared"]`.

### 4.2 클라이언트 — `client/src/`

```
client/src/
├── main.tsx
├── App.tsx                      # Router + 탭 전환
├── pages/
│   ├── MyBlogPage.tsx           # 커밋 선택 + AI 요약 + 편집기
│   └── SavedPostsPage.tsx       # 카드 그리드
├── components/
│   ├── layout/
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   ├── repo/
│   │   ├── RepoSearchInput.tsx
│   │   └── BranchSelect.tsx
│   ├── commit/
│   │   ├── CommitList.tsx
│   │   └── CommitListItem.tsx
│   ├── editor/
│   │   ├── DraftEditor.tsx
│   │   └── AISummaryPanel.tsx
│   └── saved/
│       ├── PostCard.tsx
│       └── PostCardGrid.tsx
├── hooks/
│   ├── useRepos.ts
│   ├── useBranches.ts
│   ├── useCommits.ts
│   ├── useGenerateDraft.ts
│   └── useDrafts.ts
├── lib/
│   └── api.ts                   # fetch wrapper, 에러 정규화
└── types.ts                     # shared/types.ts re-export
```

**상태관리:** React Query (서버 상태) + `useState` (편집기 로컬). 별도 store 도구 없음.

### 4.3 서버 — `server/src/`

```
server/src/
├── index.ts                     # Express bootstrap
├── env.ts                       # 환경변수 zod 검증
├── routes/
│   ├── github.ts
│   ├── drafts.ts
│   └── health.ts
├── services/
│   ├── githubClient.ts          # Octokit 래퍼
│   ├── claudeClient.ts          # Anthropic SDK 래퍼
│   └── draftStore.ts            # Map 기반 메모리 저장소
├── prompts/
│   └── blogDraftPrompt.ts
├── middleware/
│   ├── errorHandler.ts
│   └── requestLogger.ts
└── types.ts                     # shared/types.ts re-export
```

**분리 원칙:**
- `routes/`: 입력 검증 + 응답 매핑만
- `services/`: 외부 API 호출 + 도메인 로직
- `prompts/`: LLM 프롬프트만 모아 둠 (튜닝 추적)

---

## 5. API 계약

모든 응답은 `ApiResult<T>` 형태. GitHub PAT은 서버 헤더에만 포함되며 클라이언트로 노출되지 않는다.

| Method | Path | 설명 | 입력 | 출력 |
|---|---|---|---|---|
| GET | `/api/health` | 서버 ping | — | `{ ok: true }` |
| GET | `/api/github/repos` | 본인 저장소 목록 | query: `q?` | `RepoSummary[]` |
| GET | `/api/github/branches` | 브랜치 목록 | query: `repo` | `string[]` |
| GET | `/api/github/commits` | 최근 커밋 N개 | query: `repo`, `branch`, `limit?=20` | `CommitSummary[]` |
| GET | `/api/github/commits/:sha` | 커밋 상세 | query: `repo` | `CommitDetail` |
| POST | `/api/drafts/generate` | LLM 초안 생성 + 저장 | body: `{ repo, branch, sha }` | `Draft` |
| GET | `/api/drafts` | 전체 드래프트 | — | `Draft[]` |
| GET | `/api/drafts/:id` | 1건 조회 | — | `Draft` |
| PUT | `/api/drafts/:id` | 본문/제목 수정 | body: `{ title?, summary?, body? }` | `Draft` |
| POST | `/api/drafts/:id/publish` | GitHub repo에 .md push | body: `{ targetRepo?, path? }` (기본값은 아래 6.1 참조) | `Draft` (publishedUrl) |
| DELETE | `/api/drafts/:id` | 삭제 | — | `{ ok: true }` |

---

### 5.1 발행 기본값 (publish 엔드포인트 보강)

- `targetRepo` 기본값: `.env`의 `BLOG_REPO`(예: `owner/blog`). 미설정 시 발행 요청은 400으로 거절.
- `path` 기본값: `posts/{YYYY-MM-DD}-{shortSha}.md` (shortSha = `commitSha`의 앞 7자). 한국어 제목 슬러그 변환 회피.
- 같은 path가 이미 존재하면 GitHub Contents API의 update(=sha 전달) 경로로 덮어쓰기.

## 6. 상태 흐름

```
[사용자] 저장소 검색 입력
   └─ useRepos(q) ─→ GET /api/github/repos ─→ githubClient.listRepos() ─→ GitHub API

[사용자] 저장소 선택 + 브랜치 선택
   └─ useBranches(repo) ─→ GET /api/github/branches
   └─ useCommits(repo, branch) ─→ GET /api/github/commits

[사용자] 커밋 "요약 생성" 클릭
   └─ useGenerateDraft.mutate({ repo, branch, sha })
       └─ POST /api/drafts/generate
           ├─ githubClient.getCommit(sha) → CommitDetail
           ├─ buildPrompt(commit) → string
           ├─ claudeClient.complete(prompt) → { title, summary, body }
           └─ draftStore.save(draft) → Draft
       └─ React Query 캐시에 Draft 주입 → 우측 패널 렌더

[사용자] 편집 후 "블로그 포스트로 저장 및 게시"
   └─ PUT /api/drafts/:id   (먼저 저장)
   └─ POST /api/drafts/:id/publish
       ├─ markdown 직렬화
       └─ githubClient.putContent(targetRepo, path, md, message) → publishedUrl
   └─ Draft.status = 'published'
   └─ React Query invalidate → Saved Posts에 카드 등장

[사용자] Saved Posts "수정하기"
   └─ navigate → MyBlogPage(draftId=...)
   └─ 편집기에 기존 본문 로드
```

---

## 7. 검증 / 테스트

### 7.1 완료 조건 (Definition of Done)
- `npm run dev` 1회로 client + server 동시 기동
- 본인 GitHub repo에서 커밋 1건 → 초안 생성 → 편집 → 발행까지 손으로 수행 가능
- 발행된 파일이 실제 target repo에 .md로 존재
- `.env`가 gitignore되어 있고 `.env.example`에 키 이름만 존재
- 모든 외부 API 호출이 서버 경유 (클라이언트 네트워크탭에 토큰 노출 X)
- `tsc --noEmit`이 양쪽 워크스페이스에서 통과
- 모든 vitest suite 통과

### 7.2 테스트 전략 (과제 규모에 맞게 가볍게)
- **서버 단위 테스트** (Vitest): `prompts/blogDraftPrompt.ts` 입력→출력 형태, `draftStore.ts` 메모리 CRUD
- **API 통합 테스트** (Vitest + supertest): `/api/drafts/*`, GitHub/Claude는 모킹
- **수동 E2E 체크리스트:** 주차별 PR 본문에 스크린샷 + 핵심 5단계 시나리오 체크

**비범위:** Playwright/Cypress E2E, 시각 회귀, 부하 테스트.

---

## 8. 주차별 분할 + 작은 commit 체크리스트

각 체크박스 = 1 commit. 항목 문구를 그대로 conventional-commit 메시지로 사용한다.

### 📅 1주차 — 기반 + 얇은 end-to-end

**프로젝트 셋업**
- [ ] `chore: init npm workspaces (client, server, shared) + .gitignore + .env.example`
- [ ] `chore: scaffold Vite React TS in client/`
- [ ] `chore: scaffold Express TS in server/ with /api/health`
- [ ] `chore: add tailwind to client/`
- [ ] `chore: add shared/types.ts with RepoSummary/CommitSummary/Draft`
- [ ] `docs: add week1-plan.md and week2-plan.md`

**GitHub 연동 (서버)**
- [ ] `feat(server): env.ts loads GITHUB_TOKEN/ANTHROPIC_API_KEY with zod validation`
- [ ] `feat(server): githubClient.listRepos() with Octokit`
- [ ] `feat(server): GET /api/github/repos endpoint`
- [ ] `feat(server): githubClient.listBranches() + GET /api/github/branches`
- [ ] `feat(server): githubClient.listCommits() + GET /api/github/commits`
- [ ] `test(server): integration tests for /api/github/* with mocked Octokit`

**Claude 연동 + 드래프트 생성 (서버)**
- [ ] `feat(server): claudeClient.complete() with Anthropic SDK`
- [ ] `feat(server): prompts/blogDraftPrompt.ts template`
- [ ] `feat(server): draftStore.ts Map-based memory store`
- [ ] `feat(server): POST /api/drafts/generate (commit → LLM → store)`
- [ ] `feat(server): GET /api/drafts, GET /api/drafts/:id`
- [ ] `test(server): draftStore CRUD + generate route with mocked Claude`

**프론트 골격 + 데이터 페치**
- [ ] `feat(client): Header with tabs (My Blog / Saved Posts / Settings)`
- [ ] `feat(client): React Query setup + lib/api.ts fetch wrapper`
- [ ] `feat(client): useRepos + RepoSearchInput component`
- [ ] `feat(client): useBranches + BranchSelect component`
- [ ] `feat(client): useCommits + CommitList/CommitListItem components`

**얇은 end-to-end 완주**
- [ ] `feat(client): useGenerateDraft mutation + "요약 생성" button wired`
- [ ] `feat(client): AISummaryPanel renders generated draft`
- [ ] `feat(client): MyBlogPage layout matches mockup`
- [ ] `chore: README with run instructions + screenshots`

**🎯 1주차 마일스톤:** 커밋 선택 → AI 요약 → 화면 표시까지 동작.

### 📅 2주차 — 편집기, 저장, 발행, 다듬기

**편집기 + 드래프트 수정**
- [ ] `feat(server): PUT /api/drafts/:id (title/summary/body update)`
- [ ] `feat(client): DraftEditor textarea with 글자수 카운터`
- [ ] `feat(client): "취소" / "블로그 포스트로 저장" 버튼 동작`
- [ ] `test(server): PUT /api/drafts/:id integration test`

**Saved Posts 카드 그리드**
- [ ] `feat(client): useDrafts hook (list/get/delete)`
- [ ] `feat(client): SavedPostsPage with PostCardGrid`
- [ ] `feat(client): PostCard with branch tag, date, summary preview`
- [ ] `feat(client): "새 초안 작성" empty slot → navigate to MyBlogPage`
- [ ] `feat(client): "수정하기" loads existing draft into editor`

**발행 (GitHub push)**
- [ ] `feat(server): githubClient.putContent() — create/update file via Contents API`
- [ ] `feat(server): POST /api/drafts/:id/publish (md serialization + push)`
- [ ] `feat(client): "발행하기" button on PostCard + confirmation`
- [ ] `feat(client): show publishedUrl link after successful publish`
- [ ] `test(server): publish route with mocked Octokit`

**에러 처리 + UI 다듬기**
- [ ] `feat(server): errorHandler middleware with normalized { error } shape`
- [ ] `feat(client): toast/banner for API errors`
- [ ] `feat(client): loading skeletons on lists`
- [ ] `style: card thumbnails placeholder gradient (목업 톤 매치)`
- [ ] `feat(server): DELETE /api/drafts/:id endpoint`
- [ ] `feat(client): DELETE 드래프트 (수정하기 옆 옵션)`

**검증, 문서, PR**
- [ ] `docs: update README with final screenshots + .env setup`
- [ ] `docs: add skill pattern note (개발하며 발견한 패턴 1개 정리)`
- [ ] `chore: tsc --noEmit passes on both workspaces`
- [ ] `chore: all vitest suites pass`
- [ ] PR 작성 — 템플릿 5개 섹션 + 시연 스크린샷

**🎯 2주차 마일스톤:** 커밋 → 요약 → 수정 → GitHub repo에 .md 발행까지 동작.

---

## 9. 운영 규칙

- **이 문서가 단일 기준.** 다음 commit을 결정할 때 항상 이 문서의 8절 체크리스트를 본다.
- 체크리스트에 없는 작업이 발생하면 → 먼저 체크리스트에 추가하는 commit 후 작업.
- 매주 끝(또는 작업 세션 끝)에 `week1-plan.md` / `week2-plan.md`의 체크 상태 갱신.
- 시연 가능한 상태 유지 — broken `main` 금지.
- **모든 commit은 사용자가 직접 수행.** AI는 작은 작업 단위 완료 시 commit 메시지만 제안한다.
- `.env`는 절대 commit 대상이 아니며, 어떤 시점에도 token이 클라이언트 번들/응답/로그에 포함되어선 안 된다.
