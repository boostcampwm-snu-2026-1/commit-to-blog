# Blog Writing UI

## Goal

React 화면에서 Repository 선택, Branch 선택, Commit 선택, AI 초안 생성, 제목/요약/본문 편집 흐름을 한 화면에서 수행한다.

## App Entry

- `index.html`
- `vite.config.ts`
- `src/main.tsx`
- `src/app/App.tsx`
- `src/pages/CreateBlogPage.tsx`

첫 화면은 소개 페이지가 아니라 블로그 작성 워크스페이스다.

## Component Flow

1. `RepositorySelector`
   - `/api/github/repositories`를 호출해 Repository 목록을 표시한다.
   - Repository를 다시 불러오는 버튼을 제공한다.
   - 로딩, 빈 상태, 오류 상태를 표시한다.

2. `BranchSelector`
   - Repository가 선택된 뒤 Branch 목록을 표시한다.
   - Repository가 없으면 선택을 막는다.
   - 로딩, 빈 상태, 오류 상태를 표시한다.

3. `CommitSelector`
   - Branch가 선택된 뒤 Commit 목록을 표시한다.
   - checkbox로 여러 Commit을 선택할 수 있다.
   - 선택한 Commit 수를 표시한다.

4. Generate panel
   - Repository, Branch, Commit 선택 요약을 보여준다.
   - 선택한 Commit이 없으면 AI 초안 생성 버튼을 비활성화한다.
   - 생성 중에는 중복 요청을 막는다.
   - `/api/llm/drafts`를 호출한다.

5. `BlogEditor`
   - LLM 응답의 `title`, `summary`, `content`를 편집 가능한 입력으로 표시한다.
   - 초안 생성 전에도 사용자가 직접 작성할 수 있다.

## State Ownership

`CreateBlogPage`가 아래 상태를 소유한다.

- `repositories`
- `selectedRepository`
- `branches`
- `selectedBranch`
- `commits`
- `selectedCommitShas`
- `editingPost`
- `statuses`
- `errors`

Repository가 바뀌면 Branch, Commit, 선택 Commit, 편집 초안을 초기화한다. Branch가 바뀌면 Commit, 선택 Commit, 편집 초안을 초기화한다.

## API Clients

- `src/services/apiClient.ts`: 공통 fetch wrapper와 `ApiError`
- `src/services/githubApi.ts`: Repository, Branch, Commit 목록 조회
- `src/services/llmApi.ts`: LLM 초안 생성

Vite 개발 서버는 `/api` 요청을 `http://localhost:3001` Express 서버로 proxy한다.

## Verification

- `npm.cmd run typecheck`
- `npm.cmd run build`
- `http://localhost:5173`에서 앱 첫 화면 접근
- 서버가 `.env` 설정 없이 실행되어도 UI가 오류 상태를 화면에 표시하는지 확인
