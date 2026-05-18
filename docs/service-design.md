# Service Design

## Purpose

이 문서는 GitHub 활동 데이터가 LLM 블로그 초안으로 바뀌고, 사용자가 이를 편집/저장/발행하는 전체 서비스 구조를 정의한다. 이후 구현은 이 문서를 기준으로 React와 Express의 책임을 나누어 진행한다.

## Core User Flow

1. 사용자가 블로그 생성 화면에 진입한다.
2. React가 Express 서버에 GitHub Repository 목록을 요청한다.
3. 사용자가 Repository를 선택한다.
4. React가 선택한 Repository의 Branch 목록을 요청한다.
5. 사용자가 Branch를 선택한다.
6. React가 선택한 Branch의 Commit 목록을 요청한다.
7. 사용자가 블로그 초안에 포함할 Commit을 하나 이상 선택한다.
8. React가 선택한 Commit 정보를 Express 서버에 전달해 초안 생성을 요청한다.
9. Express 서버가 Commit 상세 정보와 변경 파일 정보를 수집한다.
10. Express 서버가 LLM 입력용 evidence bundle을 만든다.
11. Express 서버가 LLM API에 블로그 초안 생성을 요청한다.
12. React가 생성된 `title`, `summary`, `content`를 편집기에 표시한다.
13. 사용자가 제목, 요약, 본문을 수정한다.
14. 사용자가 포스트를 저장한다.
15. 저장된 포스트가 카드 목록에 표시된다.
16. 사용자가 저장된 포스트를 다시 열어 수정하거나 발행 상태로 전환한다.

## Data Model

```ts
export type Repository = {
  id: string;
  name: string;
  fullName: string;
  description: string | null;
  defaultBranch: string;
  htmlUrl: string;
  visibility: "public" | "private";
};

export type Branch = {
  name: string;
  sha: string;
  protected: boolean;
};

export type CommitSummary = {
  sha: string;
  message: string;
  authorName: string;
  authorDate: string;
  htmlUrl: string;
};

export type ChangedFile = {
  filename: string;
  status: "added" | "modified" | "removed" | "renamed";
  additions: number;
  deletions: number;
  patchSummary?: string;
};

export type CommitDetail = CommitSummary & {
  changedFiles: ChangedFile[];
};

export type BlogDraft = {
  title: string;
  summary: string;
  content: string;
  sourceCommitShas: string[];
};

export type BlogPostStatus = "draft" | "saved" | "published";

export type BlogPost = {
  id: string;
  title: string;
  summary: string;
  content: string;
  repositoryFullName: string;
  branchName: string;
  commitShas: string[];
  status: BlogPostStatus;
  createdAt: string;
  updatedAt: string;
};
```

## Target File Structure

```txt
src/
  app/
    App.tsx
  components/
    BranchSelector.tsx
    BlogEditor.tsx
    CommitSelector.tsx
    RepositorySelector.tsx
    SavedPostCard.tsx
    SavedPostList.tsx
  pages/
    CreateBlogPage.tsx
    SavedPostsPage.tsx
  services/
    apiClient.ts
    githubApi.ts
    llmApi.ts
    postApi.ts
  types/
    blog.ts
    github.ts
server/
  index.ts
  config/
    env.ts
  routes/
    githubRoutes.ts
    llmRoutes.ts
    postRoutes.ts
  services/
    githubService.ts
    llmService.ts
    postStore.ts
  types/
    blog.ts
    github.ts
```

## Express API Boundary

GitHub token과 LLM API key는 Express 서버에서만 사용한다. React는 항상 `/api/*` 라우트만 호출한다.

### GitHub Routes

- `GET /api/github/repositories`
  - 사용자의 Repository 목록을 반환한다.
- `GET /api/github/repositories/:owner/:repo/branches`
  - 선택한 Repository의 Branch 목록을 반환한다.
- `GET /api/github/repositories/:owner/:repo/commits?branch={branch}`
  - 선택한 Branch의 Commit 목록을 반환한다.
- `GET /api/github/repositories/:owner/:repo/commits/:sha`
  - 선택한 Commit의 상세 정보와 변경 파일 정보를 반환한다.

### LLM Routes

- `POST /api/llm/drafts`
  - body: `repositoryFullName`, `branchName`, `commitShas`
  - 서버가 Commit 상세 정보를 수집하고 LLM 초안을 생성한다.
  - response: `BlogDraft`

### Post Routes

- `GET /api/posts`
  - 저장된 포스트 목록을 반환한다.
- `POST /api/posts`
  - 편집한 초안을 저장한다.
- `GET /api/posts/:id`
  - 저장된 포스트 하나를 반환한다.
- `PUT /api/posts/:id`
  - 저장된 포스트를 수정한다.
- `PATCH /api/posts/:id/status`
  - `saved` 또는 `published` 상태로 변경한다.

## React Component Responsibilities

- `CreateBlogPage`: 블로그 생성 흐름의 상태를 조율한다.
- `RepositorySelector`: Repository 목록, 선택 상태, 로딩/빈/오류 상태를 표시한다.
- `BranchSelector`: 선택된 Repository에 맞는 Branch 목록을 표시한다.
- `CommitSelector`: Commit 목록과 선택/해제 상태를 관리한다.
- `BlogEditor`: `title`, `summary`, `content` 편집을 담당한다.
- `SavedPostsPage`: 저장된 포스트 목록 화면을 담당한다.
- `SavedPostList`: 카드 목록 레이아웃을 담당한다.
- `SavedPostCard`: 제목, 브랜치 태그, 요약, 날짜, 상태를 표시한다.

## Frontend State Flow

`CreateBlogPage`는 아래 상태를 소유한다.

- `repositories`: Repository 목록
- `selectedRepository`: 선택된 Repository
- `branches`: Branch 목록
- `selectedBranch`: 선택된 Branch
- `commits`: Commit 목록
- `selectedCommitShas`: 초안 생성에 사용할 Commit sha 목록
- `draft`: LLM으로 생성된 BlogDraft
- `editingPost`: 사용자가 편집 중인 BlogPost 입력 상태
- `requestStatus`: Repository, Branch, Commit, LLM, Save 요청별 `idle | loading | success | error`
- `errorMessage`: 사용자에게 보여줄 오류 메시지

상태 전이 규칙:

- Repository가 바뀌면 Branch, Commit, 선택된 Commit, draft를 초기화한다.
- Branch가 바뀌면 Commit, 선택된 Commit, draft를 초기화한다.
- 선택된 Commit이 없으면 초안 생성 버튼을 비활성화한다.
- LLM 생성 중에는 초안 생성 버튼을 비활성화한다.
- Draft가 생성되면 BlogEditor에 즉시 반영한다.
- 저장 성공 시 저장된 포스트 목록을 갱신하거나 이동한다.

## Storage Decision

MVP에서는 Express 서버의 `postStore`가 메모리 저장소를 담당한다. 이유는 API 흐름과 UI 검증을 빠르게 끝낼 수 있고, DB 선택으로 인한 범위 확장을 막을 수 있기 때문이다.

제약:

- 서버 재시작 시 저장된 포스트가 사라진다.
- 여러 사용자를 구분하지 않는다.
- 실제 서비스 단계에서는 파일 저장, SQLite, 또는 외부 DB로 교체해야 한다.

교체 기준:

- 새로고침 이후 데이터 유지가 필수 요구사항이 될 때
- 사용자가 여러 저장된 포스트를 장기간 관리해야 할 때
- 발행 이력이나 사용자별 데이터가 필요해질 때

## Error And Empty State Policy

- Repository 목록이 비어 있으면 연결 가능한 저장소가 없다는 메시지를 보여준다.
- Branch 목록이 비어 있으면 선택한 저장소의 브랜치를 확인하라는 메시지를 보여준다.
- Commit 목록이 비어 있으면 선택한 브랜치에 표시할 커밋이 없다는 메시지를 보여준다.
- GitHub 인증 오류는 서버 설정 문제로 안내한다.
- LLM 생성 실패는 재시도 가능한 상태로 남긴다.
- 저장 실패는 편집 중인 내용을 유지한 채 다시 저장할 수 있게 한다.

## Verification Criteria

- `checklist.md`의 2번 항목을 모두 설명한다.
- React와 Express의 책임이 겹치지 않는다.
- GitHub token과 LLM API key가 클라이언트로 이동하지 않는다.
- 데이터 모델이 Repository, Branch, Commit, BlogPost를 모두 포함한다.
- 상태 흐름이 Repository -> Branch -> Commit -> Draft -> Post 순서를 따른다.
- 저장 방식의 한계와 교체 기준이 명시되어 있다.
