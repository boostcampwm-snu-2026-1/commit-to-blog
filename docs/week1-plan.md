# 1주차 계획 — 기획 구체화 & 설계

> 목표: 2주짜리 미션 중 1주차는 "무엇을, 어떻게" 만들지 확정한다.
> 산출물: 본 설계 문서 + 빈 프로젝트 스캐폴드(택1). 코드 구현은 2주차에 집중.

---

## 0. 한 줄 요약

선택한 GitHub 저장소의 커밋 로그를 LLM으로 요약·재구성해 **개발 블로그 초안**을 생성·편집·저장하는 SPA + Express 백엔드를 만든다.

---

## 1. 도구 선정과 근거

| 영역 | 선택 | 이유 |
|---|---|---|
| FE 빌드 | **Vite + React 18 + TypeScript** | SPA 2~3페이지 규모에 SSR은 과함. Vite는 HMR이 빠르고 설정이 가벼움. TS로 GitHub/LLM 응답 타입을 강제. |
| 스타일 | **Tailwind CSS** | 예시 화면(카드 그리드, 흑백 톤, 단순 레이아웃)이 유틸리티 기반과 궁합 좋음. 디자인 시스템을 처음부터 짤 필요 없음. |
| 라우팅 | **React Router v6** | 페이지 2개(`/`, `/saved`, `/settings`) + 편집 화면. 표준이며 학습 비용 낮음. |
| 서버 상태 | **TanStack Query (React Query)** | GitHub/LLM 호출 캐싱·로딩·에러를 일관되게. 직접 `useEffect`로 짜는 보일러플레이트 제거. |
| 클라이언트 상태 | **Zustand** (선택) | "선택된 커밋", "편집 중인 초안" 같은 가벼운 UI 상태. Redux는 과함. |
| BE | **Express + TypeScript** | 미션 명시 요구사항. GitHub PAT/OpenAI Key를 서버에서만 다루기 위함. |
| GitHub 클라이언트 | **@octokit/rest** | 공식 SDK. 페이지네이션·rate limit 처리 내장. |
| LLM 클라이언트 | **openai (Node SDK)** | `gpt-4o-mini`로 비용 최소화, 필요 시 `gpt-4o`로 업그레이드. |
| 환경변수 검증 | **zod** + `dotenv` | 잘못된 env로 런타임에 죽는 사고 방지. |
| 영속성 | **JSON 파일(`server/data/drafts.json`) + fs** | MVP 범위. DB 도입은 2주차 여유 있을 때 SQLite로 확장 가능. |
| 패키지 매니저 | **pnpm + workspaces** | `apps/web`, `apps/server` 두 워크스페이스로 분리. |
| 테스트 | **Vitest** (FE/BE 공용) + **supertest** (BE API) | Jest보다 Vite와 궁합 좋음. |
| 린팅 | **ESLint + Prettier** | 기본기. |

**탈락한 후보**
- Next.js — SSR 이점이 본 미션의 핵심이 아니고, Express와 분리하는 구조에서 라우팅이 중복됨.
- CSS Modules / styled-components — Tailwind보다 시안 재현 속도가 느림.
- DB(Postgres/Prisma) — 1~2명, 1주 구현 분량에 비해 설정 비용이 큼. JSON 파일로 충분.

---

## 2. 구현 범위 (Scope)

### MVP (필수 — 2주차 안에 동작 완성)
- [ ] **F-01** Settings 페이지에서 PAT/OpenAI Key 입력 안내(키 자체는 `.env`에 저장)
- [ ] **F-02** 저장소 검색 — 사용자의 repo 목록을 가져와 input 검색으로 필터
- [ ] **F-03** 브랜치 선택 — 기본값은 default branch
- [ ] **F-04** 최근 커밋 목록 표시(최신 N개, 작성자/날짜/메시지)
- [ ] **F-05** 커밋 선택 → 우측 패널에 커밋 상세 + "AI 요약 생성" 버튼
- [ ] **F-06** LLM 요약 생성 (커밋 메시지 + 변경 파일/diff 일부 → 마크다운 초안)
- [ ] **F-07** 생성된 초안 편집(textarea + 글자수 카운트)
- [ ] **F-08** "블로그 포스트로 저장" → 서버 JSON에 영속화
- [ ] **F-09** 저장된 포스트 카드 그리드(브랜치 태그, 요약 미리보기, 날짜)
- [ ] **F-10** 카드의 "수정하기" → 편집 화면 재진입
- [ ] **F-11** 카드의 "발행하기" → status를 `published`로 토글 (실제 외부 게시는 X, 상태만)

### Nice-to-have (시간 남으면)
- [ ] 멀티 커밋 선택 후 한 번에 요약
- [ ] 발행 시 마크다운 파일 다운로드(`*.md` export)
- [ ] 프롬프트 스타일 프리셋(짧게/길게/기술적/캐주얼)
- [ ] 다크 모드
- [ ] LLM 응답 스트리밍

### 명시적 비범위 (Out of scope)
- 실제 외부 블로그(Tistory/Medium/Velog) 자동 게시 API 연동
- 멀티 유저 계정 시스템 / GitHub OAuth
- 이미지 자동 첨부

---

## 3. 데이터 구조

서버/클라이언트 공용 타입(`packages/types` 또는 각 워크스페이스에 복제).

```ts
// GitHub 원본
type Repo = {
  id: number;
  fullName: string;       // "owner/repo"
  defaultBranch: string;
  private: boolean;
  updatedAt: string;
};

type Branch = { name: string; sha: string };

type Commit = {
  sha: string;
  shortSha: string;       // 7자
  message: string;        // 첫 줄
  body?: string;          // 본문
  author: { name: string; login?: string; avatarUrl?: string };
  date: string;           // ISO8601
  url: string;            // html_url
};

type CommitDetail = Commit & {
  stats: { additions: number; deletions: number; total: number };
  files: Array<{
    filename: string;
    status: "added" | "modified" | "removed" | "renamed";
    additions: number;
    deletions: number;
    patch?: string;       // diff (서버에서 길이 제한해 클라에 내려줄지 결정)
  }>;
};

// 도메인 — 블로그 초안
type BlogDraft = {
  id: string;             // uuid
  repo: string;           // "owner/repo"
  branch: string;
  commitShas: string[];   // 다중 커밋 대응
  title: string;
  excerpt: string;        // 카드 미리보기용 (~120자)
  contentMd: string;      // 본문 마크다운
  status: "draft" | "published";
  createdAt: string;
  updatedAt: string;
};

// LLM 요청/응답
type SummarizeRequest = {
  repo: string;
  branch: string;
  commits: Pick<CommitDetail, "sha" | "message" | "body" | "files" | "stats">[];
  style?: "default" | "short" | "technical" | "casual";
};
type SummarizeResponse = {
  title: string;
  excerpt: string;
  contentMd: string;
};
```

---

## 4. 컴포넌트/디렉토리 구조

### Frontend (`apps/web`)

```
apps/web/
├─ index.html
├─ vite.config.ts
├─ tailwind.config.ts
└─ src/
   ├─ main.tsx                  # React 진입점, QueryClient/Router 세팅
   ├─ App.tsx                   # 레이아웃 + Routes
   ├─ routes/
   │  ├─ MyBlogPage.tsx         # 커밋 선택 + 요약 + 편집  (= "포스트 작성")
   │  ├─ SavedPostsPage.tsx     # 카드 그리드            (= "저장된 포스트")
   │  └─ SettingsPage.tsx
   ├─ components/
   │  ├─ layout/
   │  │  ├─ Header.tsx          # Smart Blog | My Blog · Saved · Settings
   │  │  └─ Footer.tsx
   │  ├─ posts/
   │  │  ├─ PostCard.tsx        # 카드 1장: 브랜치 태그/제목/이미지/요약/버튼
   │  │  └─ EmptyDraftCard.tsx  # "새 초안 작성" 점선 카드
   │  └─ create/
   │     ├─ RepoSearch.tsx
   │     ├─ BranchSelect.tsx
   │     ├─ CommitList.tsx
   │     ├─ CommitItem.tsx      # "요약 생성" 버튼 포함
   │     ├─ SelectedCommitHeader.tsx
   │     ├─ SummaryEditor.tsx   # AI 요약 표시/편집
   │     └─ ActionBar.tsx       # 취소 / 저장 및 게시
   ├─ hooks/
   │  ├─ useRepos.ts            # React Query → /api/github/repos
   │  ├─ useBranches.ts
   │  ├─ useCommits.ts
   │  ├─ useSummarize.ts        # mutation
   │  └─ useDrafts.ts           # CRUD
   ├─ api/                      # fetch 래퍼 (서버 BFF만 호출)
   │  ├─ client.ts              # baseURL, 에러 핸들링
   │  ├─ github.ts
   │  ├─ summarize.ts
   │  └─ drafts.ts
   ├─ store/
   │  └─ createDraftStore.ts    # Zustand: { selectedRepo, branch, commitShas, draft }
   ├─ types/index.ts
   └─ styles/index.css          # Tailwind directives
```

### Backend (`apps/server`)

```
apps/server/
├─ package.json
├─ tsconfig.json
├─ .env.example                 # GITHUB_TOKEN=, OPENAI_API_KEY=, PORT=
├─ data/
│  └─ drafts.json               # 영속화 파일 (git ignore)
└─ src/
   ├─ index.ts                  # express 부트스트랩
   ├─ app.ts                    # 미들웨어/라우트 조립
   ├─ routes/
   │  ├─ github.routes.ts       # GET /api/github/repos, /branches, /commits, /commits/:sha
   │  ├─ summarize.routes.ts    # POST /api/summarize
   │  └─ drafts.routes.ts       # GET/POST/PATCH/DELETE /api/drafts
   ├─ services/
   │  ├─ github.service.ts      # Octokit 래퍼: 페이지네이션·에러 매핑
   │  ├─ llm.service.ts         # OpenAI 호출 + 프롬프트 빌더
   │  └─ drafts.service.ts      # fs 기반 CRUD (atomic write)
   ├─ prompts/
   │  ├─ system.ts              # 시스템 프롬프트
   │  └─ buildUserPrompt.ts     # 커밋/디프 → user prompt 변환
   ├─ middleware/
   │  ├─ errorHandler.ts
   │  └─ logger.ts
   ├─ config/
   │  └─ env.ts                 # zod로 env 검증
   └─ types/index.ts
```

---

## 5. 상태 흐름

```
[Settings] PAT/OPENAI_API_KEY 를 .env 에 저장 (사용자가 직접)
            │
            ▼
[MyBlogPage 진입]
    useRepos ──HTTP──▶ /api/github/repos ──Octokit──▶ GitHub API
            │
   사용자: 저장소 선택
            │
    useBranches ─▶ /api/github/branches?repo=...
            │
   사용자: 브랜치 선택 (기본은 default branch)
            │
    useCommits ─▶ /api/github/commits?repo=...&branch=...
            │
   사용자: 커밋 카드 클릭 → store.selectedSha = sha
            │
   사용자: "요약 생성" 클릭
            │
    useCommitDetail ─▶ /api/github/commits/:sha   (diff 포함)
            │
    useSummarize.mutate(commitDetail)
            └─▶ /api/summarize ──OpenAI──▶ { title, excerpt, contentMd }
                       │
   응답 → store.draft = response
            │
   사용자: SummaryEditor 에서 수정 (controlled textarea)
            │
   사용자: "저장 및 게시" 클릭
            │
    useDrafts.create({ ...store.draft, status:'published' })
            └─▶ POST /api/drafts → drafts.json 갱신
            │
   네비게이션 → /saved
            │
[SavedPostsPage]
    useDrafts.list ─▶ GET /api/drafts → 카드 그리드
       · 카드 [수정하기] → /  (스토어에 draft load → MyBlog 진입)
       · 카드 [발행하기] → PATCH /api/drafts/:id { status:'published' }
```

상태 분담 원칙:
- **서버 상태**(repos/branches/commits/drafts) = **React Query** 만으로.
- **UI 상태**(선택된 sha, 편집 중인 draft) = **Zustand** 단일 store.
- 폼 상태는 통제 컴포넌트(useState) — react-hook-form까진 불필요.

---

## 6. 데이터 보관

| 데이터 | 위치 | 비고 |
|---|---|---|
| GITHUB_TOKEN / OPENAI_API_KEY | `apps/server/.env` | `.gitignore` 필수. 클라이언트로 절대 노출 X. |
| GitHub 응답 캐시 | 메모리(React Query) | TTL 60초 정도. 영속화 X. |
| 작성 중 draft | Zustand(메모리) + sessionStorage 백업 | 새로고침 안전망. |
| 저장된 BlogDraft 목록 | `apps/server/data/drafts.json` | fs.writeFile 임시파일 → rename(atomic). |
| (확장) | SQLite(better-sqlite3) | 다중 저장소·정렬·검색 필요해지면 마이그레이션. |

---

## 7. 주요 인터랙션 명세

| ID | 사용자 행위 | 기대 결과 | 엣지 케이스 |
|---|---|---|---|
| I-01 | 저장소 input에 키 입력 | 300ms debounce 후 매칭 항목 dropdown | 결과 0건 → "검색 결과 없음" |
| I-02 | 저장소 선택 | 브랜치 select 활성, default branch 자동 선택 | private repo + 토큰 권한 없음 → 토스트 에러 |
| I-03 | 브랜치 변경 | 커밋 목록 refetch + 우측 패널 reset | API 5xx → 재시도 버튼 표시 |
| I-04 | 커밋 카드 클릭 | 우측 "선택된 커밋" 헤더 갱신, "요약 생성" 버튼 활성 | 이미 선택된 카드 재클릭 → 변화 없음 |
| I-05 | "요약 생성" 클릭 | 버튼 → 로딩 스피너, 본문 영역 skeleton | LLM 429/타임아웃 → 에러 메시지 + 재시도 |
| I-06 | 본문 편집 | 글자수 카운트 실시간 갱신("148 chars") | 0자 → 저장 버튼 비활성 |
| I-07 | "취소" | store.draft 클리어, 페이지 유지 | 편집 내용 있을 때 confirm dialog |
| I-08 | "블로그 포스트로 저장 및 게시" | 로딩 → 성공 토스트 → `/saved` 이동 | 저장 실패 → 토스트, 페이지 유지 |
| I-09 | 카드 "수정하기" | draft 로드 후 `/` 로 이동, 편집 가능 | 원본 커밋이 force-push로 사라짐 → 경고 배너 |
| I-10 | 카드 "발행하기" | status published, 카드 배지 변경 | 이미 published → 버튼 disabled |
| I-11 | 빈 상태 | "새 초안 작성" 점선 카드 → 클릭 시 `/` 이동 | — |

---

## 8. 테스트 / 검증 방식

### 완료 조건 (Definition of Done) — 기능별
각 F-XX는 다음을 모두 충족할 때 "완료":
1. UI에서 정상 경로(happy path) 동작
2. 최소 1개 에러 경로 처리(토스트 또는 인라인 메시지)
3. TypeScript 컴파일 0 에러
4. 관련 서비스 함수에 단위 테스트 1개 이상
5. 매뉴얼 E2E 체크리스트 통과

### 자동 테스트
- **단위(Vitest)**
  - `llm.service.buildPrompt()` — 커밋 입력 → 프롬프트 문자열의 핵심 키워드 포함 검증
  - `drafts.service` — create/update/delete 후 파일 내용 검증
  - `github.service` — Octokit을 msw로 mock, 페이지네이션 합치기
- **API 통합(supertest)**
  - `/api/drafts` CRUD 라운드트립
  - `/api/summarize` — OpenAI client를 모킹해 응답 형태 검증
- **컴포넌트(Vitest + React Testing Library)** *(여유 시)*
  - `CommitList` 클릭 → `selectedSha` 변화
  - `SummaryEditor` 글자수 카운트

### 매뉴얼 E2E 시나리오 (PR 머지 전 1회)
1. PAT 설정 후 첫 진입 → 저장소 5개 이상 로드되는가
2. 브랜치 변경 시 커밋 목록 갱신되는가
3. 요약 생성 후 본문이 마크다운으로 렌더 되는가
4. 저장 → /saved 이동, 새 카드가 가장 앞에 보이는가
5. 수정하기 → 본문 수정 → 다시 저장 시 동일 카드가 업데이트되는가
6. 잘못된 PAT로는 친절한 에러 메시지가 보이는가
7. 새로고침 후 작성 중 draft 가 복원되는가(sessionStorage)

### 프롬프트 회귀 검증
- `apps/server/test/fixtures/commits/*.json` 에 샘플 커밋 5종 고정
- `pnpm test:prompt` 가 LLM 호출 결과를 `snapshots/`에 저장
- 모델/프롬프트 변경 시 snapshot diff를 사람이 확인

---

## 9. AI 활용 Workflow

1주차 동안 **AI(Claude/Cursor)와 협업하는 절차** 자체를 설계하고, 2주차에 보완한다.

```
[기획]   본 문서를 작성 → Claude에 "허점/누락된 엣지 케이스" 리뷰 요청
   │
[설계]   타입/API 시그니처 초안 → Claude에 "이 설계로 화면 1~10번 인터랙션을 다 표현 가능한가?" 검증
   │
[슬라이스]  한 기능(F-XX) 단위로 자르고 (route → service → hook → component 순) 각각을 Claude에 코드 생성 요청
   │       ↳ 항상 입력: 관련 타입 + 인접 코드 + Definition of Done
   │
[검증]   생성된 코드 직접 읽고 수정 → tsc/vitest 통과 확인 → 매뉴얼 시나리오 1개 통과 시 커밋
   │
[프롬프트 튜닝]  /summarize 결과가 기대와 다를 때:
   │       (1) 실패한 커밋 케이스를 fixture에 추가
   │       (2) system prompt 수정
   │       (3) snapshot 재생성, 사람이 검토
   │
[회고]   매일 끝에 "AI가 잘한 것 / 못한 것" 1줄씩 메모 → 다음날 프롬프트에 반영
```

규칙
- LLM에 보낼 컨텍스트는 항상 **타입 + 인접 코드 1~2 파일 + DoD** 세트로 제공.
- "이 코드 짜줘"가 아니라 **"이 인터페이스 만족하는 구현"** 으로 요청.
- 생성 코드는 사람이 한 줄 한 줄 읽고 들여보낸다. 통과 안 한 코드는 커밋 금지.

---

## 10. 만들 Skill 후보 — 1개 선정

미션 요구: "Agent 개발에서 필요한 나만의 Skill을 하나 만들어서 사용해본다." 후보:

| 후보 | 입력 | 출력 | 언제 사용 |
|---|---|---|---|
| **A. commit-to-draft** | 커밋 메시지 + diff(요약본) + 스타일 | 제목/요약/본문 마크다운(JSON) | 본 미션의 핵심 LLM 호출. 프롬프트가 안정화되면 그대로 BE에서 사용. |
| B. feature-slice | 기능명 + 화면 캡처/명세 | route/service/hook/component 단위로 잘린 작업 목록 | 슬라이스 작업 자동화 |
| C. spec-to-types | 화면 + 자연어 명세 | TS 타입 초안 | 본 문서 §3을 다른 미션에서 재사용 |

→ **1주차에는 A 선정**. 본 프로젝트의 핵심 가치이며, 결과물(프롬프트 + 픽스처 + 스냅샷)이 그대로 BE 코드에 들어감.

### Skill 정의서 — `commit-to-draft` v0
- **목적**: 커밋 1개(또는 N개)의 메시지·변경 파일·diff 일부를 입력받아, 일관된 포맷의 블로그 초안 JSON을 반환.
- **입력 스키마**: `SummarizeRequest` (§3)
- **출력 스키마**: `SummarizeResponse` (§3) — 항상 JSON만, 그 외 텍스트 금지
- **시스템 프롬프트(초안)**:
  - 한국어로, 개발자 독자 가정
  - 제목 ≤ 40자, 요약 ≤ 120자
  - 본문 구조: 배경 → 변경 사항 → 영향/주의 → 다음 단계 (각 섹션 1~3문장)
  - 추측 금지: 입력에 없는 사실(성능 수치 등) 만들어 쓰지 말 것
- **검증**: §8 "프롬프트 회귀 검증"의 fixture 5개로 통과/회귀 추적
- **2주차 개선 방향**: 스타일 프리셋, 멀티 커밋 합치기, 코드 블록 인용 규칙

---

## 11. 1주차 산출물 체크리스트

- [x] `docs/week1-plan.md` 작성
- [ ] (선택) `apps/web`, `apps/server` 빈 스캐폴드 + `.env.example`
- [ ] (선택) `apps/server/test/fixtures/commits/*.json` 샘플 3~5건 수집
- [ ] (선택) `commit-to-draft` 시스템 프롬프트 v0 작성 (`apps/server/src/prompts/system.ts` 또는 별도 md)
- [ ] 본 문서를 커밋

---

## 12. 2주차로 넘어갈 때 가져갈 질문

- React Query의 캐시 키 전략을 어떻게 정할 것인가? (repo/branch 변경 시 invalidate 범위)
- LLM 호출은 동기 응답이 충분한가, 스트리밍이 필요한가? (UX 차이 측정)
- drafts.json이 동시 쓰기에서 깨질 수 있는가? — 단일 사용자라 무시 가능 vs. 파일락 도입
- 발행(publish)을 단순 status 토글로 둘 것인가, 마크다운 파일 export까지 묶을 것인가?
