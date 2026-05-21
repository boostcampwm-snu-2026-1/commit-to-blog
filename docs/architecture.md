# Service Architecture

Commit to Blog는 GitHub 활동을 선택하고 AI 초안을 만든 뒤 SNS형 피드에 저장하는 서비스다. 구조는 frontend, backend API, domain modules, database, external API로 나뉜다.

## Frontend

- `frontend/src/app/page.tsx`
  - 메인 화면을 구성한다.
  - 인증 상태를 확인하고, 로그인 전에는 GitHub SSO 진입점을 보여준다.
  - 로그인 후 Studio, Feed, Insight 영역을 렌더링한다.

- `frontend/src/features/studio`
  - 저장소, 브랜치, 커밋 선택 UI를 담당한다.
  - 선택한 커밋으로 draft 생성 API를 호출한다.

- `frontend/src/features/feed`
  - 저장된 post 목록, publish 상태, like/comment 카운트를 표시한다.

- `frontend/src/shared/api/client.ts`
  - 모든 API 호출을 캡슐화한다.
  - `credentials: "include"`로 backend session cookie를 포함한다.

## Backend

- `backend/app/main.py`
  - FastAPI app, CORS, request id, request latency 로그를 설정한다.

- `backend/app/api/v1/api_router.py`
  - health, auth, github, drafts, posts router를 하나로 연결한다.

- `backend/app/modules/auth`
  - GitHub SSO, server-side session, 현재 사용자 조회, logout을 담당한다.
  - 브라우저 쿠키에는 opaque session id만 저장하고, 실제 GitHub access token은 DB session row에 저장한다.

- `backend/app/modules/github`
  - GitHub repository, branch, commit 조회를 담당한다.
  - `USE_MOCKS=true`에서는 외부 키 없이 mock 데이터를 반환한다.

- `backend/app/modules/drafts`
  - 선택한 commit 정보를 바탕으로 Claude draft 생성을 담당한다.
  - mock mode에서는 deterministic draft를 반환한다.

- `backend/app/modules/posts`
  - 생성된 글의 저장, 수정, 발행, like/comment, analytics를 담당한다.

- `backend/app/modules/health`
  - `/health`: 프로세스 상태 확인
  - `/ready`: DB 연결까지 확인

## Database

- SQLModel model은 domain module에 위치한다.
- Alembic migration은 `backend/alembic/versions`에서 schema 변경을 관리한다.
- 주요 테이블:
  - `authsession`: GitHub SSO session
  - `blogpost`: 저장된 개발 블로그 post

## External API Boundary

- GitHub OAuth: `backend/app/modules/auth/service.py`
- GitHub REST API: `backend/app/modules/github/service.py`
- Claude Messages API: `backend/app/modules/drafts/service.py`
- retry/rate-limit 공통 처리: `backend/app/utils/http_retry.py`

Frontend는 외부 API를 직접 호출하지 않고 backend API만 호출한다.

## Main User Flow

1. 사용자가 frontend에서 `Continue with GitHub`를 클릭한다.
2. Backend auth router가 GitHub OAuth로 redirect한다.
3. callback에서 GitHub user와 org 정보를 확인한다.
4. backend가 `authsession` row를 만들고 session id cookie를 설정한다.
5. frontend가 `/auth/me`로 로그인 상태를 확인한다.
6. 사용자가 repository, branch, commit을 선택한다.
7. frontend가 `/drafts`를 호출한다.
8. backend가 GitHub commit detail을 조회하고 Claude draft를 생성한다.
9. 사용자가 draft를 수정해 `/posts`에 저장한다.
10. feed가 저장된 post를 SNS 카드 형태로 보여준다.

## Quality Gates

- Backend: `ruff`, `pytest`, Alembic migration
- Frontend: `eslint`, `prettier`, `tsc`, `next build`
- E2E: Playwright Chrome flow
- Runtime: Docker compose healthcheck, `/health`, `/ready`
