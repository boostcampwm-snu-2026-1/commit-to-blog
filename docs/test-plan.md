# 테스트 / 검증 계획

> "구현이 완료된 조건은 무엇인가? 어떻게 검증하고 어떻게 테스트 할 것인가?" — PDF 가이드.

---

## 1. 검증 레이어

| 레이어 | 도구 | 11주차 | 12주차 |
|---|---|---|---|
| 타입 안정성 | `tsc --noEmit` (`npm run typecheck`) | 필수 (통과) | 필수 |
| 정적 빌드 | `vite build`, `tsc -p` | 필수 (통과) | 필수 |
| API 스모크 | `curl` 으로 핵심 엔드포인트 | 필수 (통과) | 필수 |
| UI 수동 | 브라우저에서 화면별 행동 확인 | 권장 | 필수 |
| 단위 테스트 | Vitest | 미도입 | 핵심 path 도입 |
| 통합 테스트 | supertest + Vitest | 미도입 | (Could) |
| E2E | Playwright | 미도입 | 미도입 |

## 2. Definition of Done — 11주차

`feature/week11` PR Draft 상태에서 다음이 모두 참:

- [ ] `npm run typecheck` 통과 (workspaces 3개 모두)
- [ ] `npm run build -w apps/client` 통과
- [ ] `npm run dev -w apps/server` → `GET /healthz` 가 200 + `{ok:true}` 응답
- [ ] `GET /api/repos` 가 mock 또는 실제 repo 목록 반환
- [ ] `GET /api/repos?q=…` 가 부분 일치 필터링
- [ ] 정의되지 않은 경로가 `404 NOT_FOUND` 에러 envelope 반환
- [ ] `npm run dev -w apps/client` → `http://localhost:5173` 에서 카드 목록 렌더
- [ ] `docs/` 안의 9개 문서가 commit 되어 있음 (plan-week11/12, requirements, user-flow, scope, tech-stack, data-model, architecture, state-flow, api-spec, ai-workflow, test-plan, checklist)
- [ ] `CLAUDE.md`, `README.md` 채워져 있음
- [ ] `.claude/skills/feature-scaffold/SKILL.md` 존재
- [ ] `.env`, `node_modules/`, `dist/` 가 모두 untracked

## 3. Definition of Done — 12주차 (참고)

- [ ] `/create` 에서 저장소 → 브랜치 → 커밋 → AI 요약 플로우가 끝까지 동작
- [ ] 저장한 포스트가 새로고침 후에도 카드 목록에 보임
- [ ] 발행 토글이 상태/시각 표시에 반영
- [ ] `GITHUB_TOKEN`, `OPENAI_API_KEY` 실제 값으로 한 번 이상 성공
- [ ] Vitest 로 `listRepos` filter, `makeContextKey`, `errorHandler` 동작 검증

## 4. 매뉴얼 테스트 케이스 — 11주차

### TC-1. healthz
```
curl -sS http://localhost:4000/healthz
```
- 기대: `{"ok":true,"version":"0.1.0","uptimeMs":<number>,"env":{...}}` (HTTP 200)

### TC-2. repo list (mock)
사전 조건: `.env` 의 `GITHUB_TOKEN` 미설정.
```
curl -sS http://localhost:4000/api/repos
```
- 기대: `{"repos":[…3개…]}` — `mockData.ts` 의 3개 항목.

### TC-3. repo search
```
curl -sS 'http://localhost:4000/api/repos?q=commit'
```
- 기대: `commit` 을 포함하는 repo 만 반환 (1개).

### TC-4. invalid query
```
curl -sS 'http://localhost:4000/api/repos?q='
```
- 기대: 빈 문자열은 Zod 의 `min(1)` 에 걸려 400. `BAD_REQUEST` envelope.

### TC-5. 404
```
curl -sS http://localhost:4000/api/posts
```
- 기대: 404 + `NOT_FOUND` 코드 envelope (week12 에서 활성화 예정).

### TC-6. real GitHub (선택)
사전 조건: `.env` 에 유효한 `GITHUB_TOKEN`.
```
curl -sS http://localhost:4000/api/repos | jq '.repos | length'
```
- 기대: 1 이상의 정수. mock 데이터가 아닌 실제 repo 이름이 보여야 함.

### TC-7. 클라이언트 카드 렌더
- `npm run dev` 후 `http://localhost:5173/create` 접속.
- 검색창에 문자 입력 시 카드 목록이 즉시 필터링되어야 함.
- "선택" 버튼 클릭 시 상단에 "선택된 저장소" 배너 표시.

## 5. 회귀 방지

- 의미 단위마다 commit → `git log --oneline` 으로 변경 시점 추적.
- PR 본문에 "변경 전후 화면 스크린샷" 첨부 (12주차).
- `feature-scaffold` Skill 사용 시 마지막 단계의 verify 체크리스트를 반드시 실행.

## 6. 향후 도입 후보

- **Vitest**: `apps/server/src/services/github/listRepos.test.ts` 로 시작. mock fetch 로 GraphQL 호출 차단.
- **supertest**: `apps/server` 라우트 통합 테스트. `createApp()` 을 인메모리로 띄움.
- **MSW (Mock Service Worker)**: 클라이언트 단 통합 테스트.
- **Playwright**: 시간 남으면. 저장 → 카드 표시 → 발행 한 시나리오만.
