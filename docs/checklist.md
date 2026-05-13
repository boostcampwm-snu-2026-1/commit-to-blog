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
- [ ] `feature/week11` push
- [ ] Draft PR 생성 (PR 템플릿 4섹션 채움)

---

## 12주차 (개발)

### API
- [ ] `GET /api/repos/:owner/:repo/branches` 실제 구현
- [ ] `GET /api/repos/:owner/:repo/commits?branch=…&limit=…` 실제 구현
- [ ] `POST /api/posts/draft` (OpenAI 호출)
- [ ] `GET /api/posts`, `POST /api/posts`, `GET /api/posts/:id`, `PUT /api/posts/:id`, `PATCH /api/posts/:id/publish`, `DELETE /api/posts/:id`
- [ ] `apps/server/src/services/posts/repository.ts` (in-memory + JSON 영속화)
- [ ] `apps/server/src/services/llm/prompts/blogDraft.ts`

### Client
- [ ] `BranchSelect`, `CommitPicker` 컴포넌트
- [ ] `AiSummaryPanel` + 로딩/에러 상태
- [ ] `PostEditor` (글자수 카운터)
- [ ] `SavedPostsPage` 카드 렌더 (브랜치 태그, 요약 미리보기, 날짜)
- [ ] 수정 / 발행 플로우

### 검증
- [ ] Vitest 핵심 path 단위 테스트
- [ ] 통합 시나리오 수동 클릭 (TC-1 ~ TC-7 + 신규 케이스)
- [ ] 데모용 스크린샷 캡처

### 마감
- [ ] `feature/week12` 브랜치
- [ ] PR draft → ready 전환 (자동 머지 적합 시점에 맞춰)
- [ ] PR 본문 4섹션 작성 + 스크린샷 첨부

---

## 자주 빠뜨리는 체크 (한 번 더)

- [ ] 새 shared 타입 → `packages/shared/src/index.ts` 에 `export * from` 추가했는가?
- [ ] 새 Express route → `apps/server/src/app.ts` 에 `app.use()` 등록했는가?
- [ ] commit 직전 → `Co-Authored-By: Claude` 라인 없는지 확인했는가?
- [ ] PR → Draft 상태로 두었는가? (자동 머지 회피)
- [ ] `.env` 가 commit 에 안 들어갔는지 (`git status`) 확인했는가?
