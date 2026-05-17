---
name: feature-scaffold
description: 새 도메인을 commit-to-blog 모노레포에 추가할 때, shared 타입 → Express 서비스+라우트 → React API 클라이언트+feature 컴포넌트+페이지 hook 까지 일관된 패턴으로 한 번에 만든다. 화면 1개를 새로 그릴 때 누락 파일·연결 오류·타입 불일치를 줄이려고 만든 스킬.
allowed-tools: Read, Write, Edit, Bash
---

# feature-scaffold — 도메인 한 묶음 만들기

## 언제 쓰는가
- 새 화면이나 API 도메인을 추가할 때. 예: `branches`, `commits`, `drafts`, `posts`.
- 같은 패턴을 손으로 5~7개 파일에 흩뿌리다 보면 한두 군데 오타·import 누락이 새는데, 이를 막기 위함.

## 언제 쓰지 않는가
- 기존 도메인 안에서 필드/엔드포인트 한 개만 추가할 때 (그건 `Edit` 한두 번이면 끝).
- React 컴포넌트 1개만 더 만들 때.

## 입력으로 받아야 하는 정보

질문 4개를 먼저 정리한 다음 작업을 시작한다.

1. **도메인 이름** (`camelCase` 단수): 예 `branch`, `commit`, `draft`.
2. **HTTP 메서드/경로**: 예 `GET /api/repos/:owner/:repo/branches`.
3. **응답 타입의 핵심 필드**: 예 `name: string, isDefault: boolean, headSha: string`.
4. **클라이언트에서 어디서 쓰는가**: 페이지/기존 feature/새 feature 중 어디.

## 생성·수정 파일 (체크리스트)

### A. shared 타입
- [ ] `packages/shared/src/types/<domain>.ts` — `export type <Domain>`, `List<Domains>Response` 등.
- [ ] `packages/shared/src/index.ts` 에 `export * from "./types/<domain>.js"` 추가.

### B. 서버 service
- [ ] `apps/server/src/services/<group>/list<Domains>.ts` (혹은 `get<Domain>`).
  - `hasGithubToken()` / `hasOpenAiKey()` 체크 후 mock fallback 또는 실제 호출.
  - 응답을 shared 타입으로 변환하는 `to<Domain>` 헬퍼.
- [ ] (선택) `apps/server/src/services/<group>/mockData.ts` 에 더미 데이터 추가.

### C. 서버 route
- [ ] `apps/server/src/routes/<domain>.ts` — Zod 스키마로 검증, `asyncHandler` 로 감싸기.
- [ ] `apps/server/src/app.ts` 의 `app.use("/api", ...)` 라인에 라우터 등록.

### D. 클라이언트 API
- [ ] `apps/client/src/api/<domain>.ts` — `apiFetch<...>("/api/<path>")` 호출 함수.

### E. 클라이언트 feature
- [ ] `apps/client/src/features/<domain>/use<Domains>.ts` — React Query hook (`useQuery` 또는 `useMutation`).
- [ ] `apps/client/src/features/<domain>/<Domain>Card.tsx` (또는 `<Domain>List.tsx`) — UI.

### F. 페이지 연결
- [ ] 호출 페이지에 `use<Domains>()` 추가 + 로딩/에러/빈 상태 분기.

### G. 검증
- [ ] `npm run typecheck` 통과.
- [ ] 서버 부팅 후 `curl localhost:4000/api/<path>` 로 응답 확인.
- [ ] 클라이언트에서 화면 렌더 확인.

## 일관성 규칙 (자기 자신과의 약속)

- 클라이언트는 **절대로** 외부 토큰을 다루지 않는다. 항상 Express 서버 경유.
- 서버 응답에는 항상 한 단계의 wrapper (`{ repos: ... }`, `{ branches: ... }`) 를 둔다. 배열을 최상위에 두지 않는다.
- 에러는 `ApiError.*()` 헬퍼로만 만든다. `next(new Error(...))` 금지.
- 모든 시간 필드는 UTC ISO 8601 문자열. 로컬 표시 변환은 클라이언트에서.
- 새 sha 필드는 항상 `sha`(40자) + `shortSha`(7자) 쌍으로.
- React feature 폴더 안 hook 파일명은 `useXxx.ts`, 컴포넌트는 `PascalCase.tsx`.

## 단계별 진행 가이드

1. **요구사항 정리**: 위 4가지 입력을 한 줄씩 적어둔다. 명확하지 않으면 사용자에게 물어보고 진행.
2. **shared 타입 먼저**: 가장 작은 단위. 여기서 타입이 명확해야 후속 파일이 깔끔.
3. **서버 service → route → app.ts** 순서. mock fallback 도 함께.
4. **`npm run typecheck -w packages/shared && npm run typecheck -w apps/server`** 로 중간 검증.
5. **클라이언트 api → feature → page** 순서.
6. **`npm run typecheck`** 전체 통과 확인.
7. **smoke test**: 서버 띄우고 `curl`, 클라이언트 띄우고 화면 확인.
8. **commit**: `Add <domain> feature: shared types, server route, client UI`.

## 자주 빠뜨리는 것

- `packages/shared/src/index.ts` 에 `export * from` 추가하기를 잊는다 → 클라이언트/서버에서 import 깨짐.
- `apps/server/src/app.ts` 에 새 라우터 `app.use()` 등록을 잊는다 → 404.
- Zod 스키마에서 path param 검증을 빼먹는다 → `:owner/:repo` 에 슬래시 들어오면 폭발.
- React Query `queryKey` 에 검색어/필터 값을 빠뜨린다 → 캐시 충돌.
- mock fallback 의 더미 응답 형식이 실제 응답과 미묘하게 어긋난다 → 통합 시 디버깅.

## 회고에 적기

이 Skill 을 사용한 뒤 발견한 패턴/문제는 [`docs/ai-workflow.md`](../../../docs/ai-workflow.md) 의 "Skill 개선 노트" 섹션에 추가한다. Skill 은 한 번에 완성되지 않고, 사용하며 자란다.
