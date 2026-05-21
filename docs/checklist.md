# 개발 체크리스트

> PR 템플릿이 commit 을 요구하는 파일. 작업 진행 상황과 다음에 할 일을 한 장에서 본다.

---

## 11주차 (기획·설계 + 프로토타입)

### 보안 / 부트스트랩
- [x] `.gitignore` 작성 (env, node_modules, dist, tsbuildinfo)
- [x] `.env.example` 작성 (`GITHUB_TOKEN`, `OPENAI_API_KEY`)
- [x] `feature/week11` 브랜치 생성

### 기획 문서
- [x] `docs/plan-week11.md`
- [x] `docs/plan-week12.md`
- [x] `docs/requirements.md`
- [x] `docs/user-flow.md`
- [x] `docs/scope.md`

### 설계 문서
- [x] `docs/tech-stack.md`
- [x] `docs/data-model.md`
- [x] `docs/architecture.md`
- [x] `docs/state-flow.md`
- [x] `docs/api-spec.md`

### 프로토타입
- [x] 루트 `package.json` (npm workspaces)
- [x] `tsconfig.base.json`
- [x] `packages/shared` — `Repo`, `Branch`, `Commit`, `Draft`, `Post`, `ApiErrorBody` 타입
- [x] `apps/server` — Express + Octokit + `GET /api/repos` (+ mock fallback) + `/healthz`
- [x] `apps/client` — Vite + React + Tailwind + 카드 목록 화면
- [x] `npm run typecheck` 전체 통과
- [x] `npm run build -w apps/client` 통과
- [x] 서버 스모크 테스트 (`/healthz`, `/api/repos`, `/api/repos?q=…`, 404) 통과

### AI Workflow / Skill
- [x] `.claude/skills/feature-scaffold/SKILL.md`
- [x] `docs/ai-workflow.md`
- [x] `docs/test-plan.md`

### 마감
- [x] `CLAUDE.md`
- [x] `docs/checklist.md` (이 파일)
- [x] `README.md`
- [x] `feature/week11` push (사용자가 직접 PR 작성)

---

## 12주차 (개발)

### API
- [x] `GET /api/repos/:owner/:repo/branches` 실제 구현 (Octokit GraphQL + mock fallback)
- [x] `GET /api/repos/:owner/:repo/commits?branch=…&limit=…` 실제 구현
- [x] `POST /api/posts/draft` (OpenAI 호출, mock fallback, LRU 캐시 50개)
- [x] `GET /api/posts`, `POST /api/posts`, `GET /api/posts/:id`, `PUT /api/posts/:id`, `PATCH /api/posts/:id/publish`, `DELETE /api/posts/:id`
- [x] `apps/server/src/services/posts/repository.ts` (Map + atomic JSON 영속화, 200ms debounce)
- [x] `apps/server/src/services/llm/prompts/blogDraft.ts`
- [x] `apps/server/src/services/github/getDiff.ts` (REST compare + 파일별 8KB / 전체 32KB truncation)

### Client
- [x] `BranchSelect`, `CommitPicker` 컴포넌트
- [x] `AiSummaryPanel` + 로딩/에러 상태
- [x] `PostEditor` (글자수 카운터 — 우하단 `N chars`, 편집/분할/미리보기 모드 토글, 태그 입력)
- [x] `SavedPostsPage` 카드 렌더 (브랜치 태그 + 요약 미리보기 + 날짜 + 상태 뱃지 + 검색 + 태그 필터)
- [x] 수정 / 발행 / 게시 취소 / 삭제 / GitHub Issue 발행 / 태그 클릭 필터 플로우
- [x] `EditPostPage` (`/posts/:id/edit`)
- [x] `PostDetailPage` (`/posts/:id`) — 읽기 전용 마크다운 렌더 + 공유 URL 복사
- [x] 다크 모드 (Tailwind class 전략, localStorage 영속, 헤더 토글)

### 검증
- [x] Vitest 핵심 path 단위 테스트 — 13 tests passing (`makeContextKey`, `LruCache`, `squashDiffsForLlm`)
- [x] 서버 스모크: branches / commits / draft (mock) / posts CRUD / publish toggle / 404 / Zod 검증 에러
- [x] 클라이언트 `vite build` 통과 (106 modules, 227kB JS)
- [ ] 데모용 스크린샷 캡처 *(사용자 영역)*

### 마감
- [x] `feature/week12` 브랜치
- [ ] PR draft → ready 전환 *(사용자 영역, 자동 머지 일정에 맞춰)*
- [ ] PR 본문 4섹션 작성 + 스크린샷 첨부 *(사용자 영역)*

---

## 자주 빠뜨리는 체크 (한 번 더)

- [ ] 새 shared 타입 → `packages/shared/src/index.ts` 에 `export * from` 추가했는가?
- [ ] 새 Express route → `apps/server/src/app.ts` 에 `app.use()` 등록했는가?
- [ ] commit 직전 → `Co-Authored-By: Claude` 라인 없는지 확인했는가?
- [ ] PR → Draft 상태로 두었는가? (자동 머지 회피)
- [ ] `.env` 가 commit 에 안 들어갔는지 (`git status`) 확인했는가?
