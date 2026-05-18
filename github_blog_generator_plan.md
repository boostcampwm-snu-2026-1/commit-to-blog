# GitHub 활동 데이터 기반 자동 개발 블로그 생성 서비스 개발 계획 및 설계

## 1. 도구 선택

| 영역 | 도구 |
|---|---|
| Frontend | React + TypeScript + Vite |
| Routing | React Router |
| Server State | TanStack Query |
| Client State | Zustand 또는 Context API |
| Editor | Tiptap 또는 Markdown Editor |
| Styling | Tailwind CSS + shadcn/ui |
| Backend | Express + TypeScript |
| DB | PostgreSQL |
| ORM | Prisma |
| Auth | GitHub OAuth |
| GitHub API | GitHub REST API |
| AI | OpenAI Responses API / Structured Outputs |
| 배포 | Vercel 또는 Netlify + Render/Fly.io/Railway |
| 테스트 | Vitest, React Testing Library, Supertest, Playwright |

### 왜 이 조합이 적합한가?

이 서비스는 **GitHub API 데이터, AI 생성 결과, 저장된 포스트 목록**처럼 서버에서 가져오는 비동기 데이터가 많다. 따라서 React 내부 상태만으로 관리하기보다 **TanStack Query**를 사용해 서버 상태를 캐싱하고 갱신하는 것이 적합하다.

라우팅은 저장소 선택, 커밋 선택, 글 생성, 편집, 저장 글 목록, 상세 보기처럼 화면 흐름이 명확하므로 **React Router**가 적합하다.

GitHub 데이터는 공식 REST API를 통해 가져오는 것이 안정적이다. 저장소, 브랜치, 커밋 정보는 각각 GitHub REST API의 repository, branch, commit 관련 엔드포인트를 사용할 수 있다.

AI 응답은 단순 텍스트로 받기보다 **Structured Outputs**를 사용하는 것이 좋다. 블로그 초안을 `title`, `summary`, `tags`, `sections`, `bodyMarkdown` 같은 정해진 JSON 구조로 받으면 프론트엔드에서 다루기 쉽고, 후속 편집/저장도 안정적이다.

---

## 2. 구현 범위 정하기

### MVP 범위

#### GitHub 연동

- GitHub OAuth 로그인
- 사용자의 Repository 목록 조회
- Repository 선택
- Branch 목록 조회
- Branch 선택
- Commit 목록 조회
- Commit 다중 선택
- 선택한 Commit의 diff / changed files 조회

#### 블로그 생성

- 선택한 커밋 메시지, 변경 파일, diff 요약을 백엔드로 전송
- LLM으로 블로그 초안 생성
- 제목, 요약, 태그, 본문 Markdown 생성
- 생성된 글을 편집기로 전달

#### 편집기

- 생성된 Markdown 초안 표시
- 제목 수정
- 태그 수정
- 본문 수정
- 임시 저장
- 저장 완료

#### 저장된 포스트 보기

- 저장된 포스트 카드 목록
- 카드에 제목, 브랜치 태그, 요약, 날짜 표시
- 상세 보기
- 다시 편집
- 발행 상태 변경

#### 발행

MVP에서는 실제 외부 블로그 플랫폼 연동까지 하지 말고, 우선 내부 상태만 다음처럼 관리하기로 한다.

```ts
status: "draft" | "published"
```

즉, “발행” 버튼을 누르면 DB에서 `published` 상태로 바뀌는 수준까지 구현한다.

---

## 3. 데이터 구조 정의

### 필요한 핵심 데이터

이 서비스에서 필요한 데이터는 크게 네 종류이다.

1. 사용자 정보
2. GitHub 연동 정보
3. 선택된 분석 대상 정보
4. 생성/저장된 블로그 포스트

---

### DB 모델 예시

#### User

```ts
type User = {
  id: string;
  githubId: string;
  username: string;
  avatarUrl?: string; // 프로필 이미지
  accessTokenEncrypted: string;
  createdAt: Date;
  updatedAt: Date;
};
```

GitHub API를 호출하려면 access token이 필요하다. 단, DB에는 평문으로 저장하지 말고 암호화해서 저장해야 한다.

---

#### RepositorySnapshot

```ts
type RepositorySnapshot = {
  id: string;
  userId: string;
  githubRepoId: number;
  owner: string;
  name: string;
  fullName: string;
  defaultBranch: string;
  private: boolean;
  htmlUrl: string;
  createdAt: Date;
};
```

GitHub Repository 정보는 매번 실시간으로 가져와도 되지만, 사용자가 어떤 저장소를 선택했는지 기록하려면 snapshot 형태로 저장하는 것이 좋다.

---

#### CommitSelection

```ts
type CommitSelection = {
  id: string;
  userId: string;
  repositoryId: string;
  branchName: string;
  commitShas: string[];
  createdAt: Date;
};
```

사용자가 어떤 브랜치와 커밋을 선택했는지 저장한다.

---

#### CommitDetail

```ts
type CommitDetail = {
  sha: string;
  message: string;
  authorName: string;
  authorDate: string;
  htmlUrl: string;
  files: ChangedFile[];
};

type ChangedFile = {
  filename: string;
  status: "added" | "modified" | "removed" | "renamed";
  additions: number;
  deletions: number;
  patch?: string;
};
```

이 데이터는 GitHub API에서 가져온 뒤 AI 요약에 사용한다.

---

#### Post

```ts
type Post = {
  id: string;
  userId: string;
  repositoryId: string;
  commitSelectionId?: string;

  title: string;
  summary: string;
  bodyMarkdown: string;
  tags: string[];

  repoName: string;
  branchName: string;
  commitShas: string[];

  status: "draft" | "published";
  visibility: "private" | "public"; // 깃헙 레포의 상태에 따라 초기값 결정

  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
};
```

카드형 목록에서는 `title`, `summary`, `tags`, `branchName`, `createdAt`, `status` 정도만 필요하다.

---

## 4. 화면 설계

### 주요 페이지

```txt
/login
  GitHub 로그인

/dashboard
  저장된 포스트 목록

/generate
  블로그 생성 시작 페이지

/generate/repository
  저장소 선택

/generate/commits
  브랜치 및 커밋 선택

/generate/preview
  AI 생성 결과 미리보기 및 편집

/posts/:postId
  저장된 글 상세 보기

/posts/:postId/edit
  저장된 글 수정

/posts/:postId/publish
  최종 검토 및 발행
```

---

## 5. React 컴포넌트 구조

### 디렉토리 구조

```txt
src/
  app/
    App.tsx
    router.tsx
    queryClient.ts
    providers.tsx

  pages/
    LoginPage.tsx
    DashboardPage.tsx
    RepositorySelectPage.tsx
    CommitSelectPage.tsx
    PostGeneratePreviewPage.tsx
    PostDetailPage.tsx
    PostEditPage.tsx

  features/
    auth/
      api/
        authApi.ts
      hooks/
        useCurrentUser.ts
      components/
        GitHubLoginButton.tsx

    github/
      api/
        githubApi.ts
      hooks/
        useRepositories.ts
        useBranches.ts
        useCommits.ts
        useCommitDetails.ts
      components/
        RepositoryCard.tsx
        RepositoryList.tsx
        BranchSelector.tsx
        CommitList.tsx
        CommitItem.tsx
        CommitDiffPreview.tsx

    post-generator/
      api/
        postGeneratorApi.ts
      hooks/
        useGeneratePost.ts
      components/
        GenerateStepLayout.tsx
        SelectedCommitSummary.tsx
        GenerateButton.tsx
        GeneratedPostPreview.tsx

    posts/
      api/
        postsApi.ts
      hooks/
        usePosts.ts
        usePost.ts
        useSavePost.ts
        useUpdatePost.ts
        usePublishPost.ts
      components/
        PostCard.tsx
        PostCardList.tsx
        PostEditor.tsx
        PostStatusBadge.tsx
        PostMetaPanel.tsx
        PublishConfirmModal.tsx

  shared/
    components/
      Button.tsx
      Input.tsx
      Card.tsx
      Modal.tsx
      Spinner.tsx
      EmptyState.tsx
      ErrorMessage.tsx

    types/
      user.ts
      github.ts
      post.ts

    utils/
      date.ts
      truncate.ts
      markdown.ts
```

---

### 주요 컴포넌트 역할

#### `RepositoryList.tsx`

사용자의 GitHub Repository 목록을 보여준다.

역할:

- repository 목록 렌더링
- 검색/필터링
- repository 선택 이벤트 전달

---

#### `BranchSelector.tsx`

선택된 repository의 branch 목록을 보여준다.

역할:

- branch 목록 fetch
- branch 선택
- 선택된 branch 상태 표시

---

#### `CommitList.tsx`

선택한 branch의 commit 목록을 보여준다.

역할:

- commit 목록 fetch
- checkbox로 여러 commit 선택
- commit message, author, date 표시

---

#### `CommitDiffPreview.tsx`

선택된 commit의 변경 파일 요약을 보여준다.

역할:

- 변경 파일 목록 표시
- additions/deletions 표시
- 너무 긴 diff는 접기 처리

---

#### `GeneratedPostPreview.tsx`

AI가 생성한 초안을 보여준다.

역할:

- 생성된 title, summary, bodyMarkdown 표시
- “편집하기”, “저장하기” 버튼 제공

---

#### `PostEditor.tsx`

사용자가 글을 직접 수정하는 편집기이다.

역할:

- 제목 입력
- 태그 입력
- Markdown 본문 편집
- 미리보기
- 저장

---

#### `PostCard.tsx`

저장된 글 목록에서 하나의 글을 카드로 보여준다.

역할:

- 제목
- 요약 미리보기
- 브랜치 태그
- 날짜
- draft/published 상태
- 수정/상세 보기 버튼

---

## 6. Express 디렉토리 구조

```txt
server/
  src/
    app.ts
    server.ts

    config/
      env.ts
      cors.ts

    routes/
      auth.routes.ts
      github.routes.ts
      post-generator.routes.ts
      posts.routes.ts

    controllers/
      auth.controller.ts
      github.controller.ts
      post-generator.controller.ts
      posts.controller.ts

    services/
      auth.service.ts
      github.service.ts
      openai.service.ts
      post-generator.service.ts
      posts.service.ts

    repositories/
      user.repository.ts
      post.repository.ts
      repository.repository.ts
      commit-selection.repository.ts

    middlewares/
      auth.middleware.ts
      error.middleware.ts
      validate.middleware.ts

    schemas/
      post.schema.ts
      github.schema.ts
      generator.schema.ts

    types/
      user.ts
      github.ts
      post.ts

    utils/
      encrypt.ts
      logger.ts
      asyncHandler.ts

  prisma/
    schema.prisma
    migrations/
```

---

### 주요 파일 역할

#### `github.service.ts`

GitHub API 호출 담당.

```ts
getRepositories(userId)
getBranches(userId, owner, repo)
getCommits(userId, owner, repo, branch)
getCommitDetail(userId, owner, repo, sha)
```

---

#### `openai.service.ts`

LLM 호출 담당.

```ts
generateBlogPostFromCommits(input)
```

역할:

- commit message 정리
- diff 요약
- prompt 구성
- OpenAI API 호출
- structured output 검증

---

#### `post-generator.service.ts`

GitHub 데이터와 OpenAI 호출을 연결하는 서비스.

```ts
generatePostDraft({
  userId,
  repository,
  branchName,
  commitShas
})
```

역할:

1. commit 상세 정보 조회
2. 변경 파일 정리
3. 너무 긴 patch 축약
4. AI 요약 요청
5. 블로그 초안 반환

---

#### `posts.service.ts`

저장된 포스트 CRUD 담당.

```ts
createPost()
getPosts()
getPostById()
updatePost()
publishPost()
deletePost()
```

---

## 7. API 설계

### Auth

```txt
GET /api/auth/github
GET /api/auth/github/callback
GET /api/auth/me
POST /api/auth/logout
```

---

### GitHub

```txt
GET /api/github/repositories
GET /api/github/repositories/:owner/:repo/branches
GET /api/github/repositories/:owner/:repo/commits?branch=main
GET /api/github/repositories/:owner/:repo/commits/:sha
```

---

### Blog Generator

```txt
POST /api/post-generator/generate
```

Request:

```json
{
  "owner": "username",
  "repo": "my-project",
  "branchName": "feature/login",
  "commitShas": ["abc123", "def456"]
}
```

Response:

```json
{
  "title": "GitHub OAuth 로그인 기능 구현기",
  "summary": "이번 작업에서는 GitHub OAuth 로그인 흐름과 사용자 인증 상태 관리를 구현했다.",
  "tags": ["GitHub", "OAuth", "React", "Express"],
  "bodyMarkdown": "..."
}
```

---

### Posts

```txt
GET /api/posts
GET /api/posts/:postId
POST /api/posts
PATCH /api/posts/:postId
PATCH /api/posts/:postId/publish
DELETE /api/posts/:postId
```

---

## 8. 상태 흐름

### 전체 상태 흐름

```txt
GitHub 로그인
  ↓
사용자 정보 저장
  ↓
Repository 목록 조회
  ↓
Repository 선택
  ↓
Branch 목록 조회
  ↓
Branch 선택
  ↓
Commit 목록 조회
  ↓
Commit 다중 선택
  ↓
Generate 요청
  ↓
Backend에서 commit detail + diff 조회
  ↓
OpenAI로 블로그 초안 생성
  ↓
Frontend 편집기로 전달
  ↓
사용자 수정
  ↓
DB에 draft 저장
  ↓
Dashboard 카드 목록에 표시
  ↓
수정 또는 발행
```

---

### 어떤 상태를 어디에 둘 것인가?

#### TanStack Query에 둘 상태

서버에서 가져오는 데이터이다.

```txt
currentUser
repositories
branches
commits
commitDetail
posts
postDetail
```

이 데이터들은 fetch, cache, refetch가 필요하므로 TanStack Query에 두는 것이 적합하다.

---

#### Zustand 또는 Context에 둘 상태

블로그 생성 과정에서만 유지되는 임시 UI 상태이다.

```ts
type GenerateFlowState = {
  selectedRepository: Repository | null;
  selectedBranch: string | null;
  selectedCommitShas: string[];
  generatedDraft: GeneratedPostDraft | null;
};
```

이 상태는 아직 DB에 저장된 데이터가 아니므로 client state로 관리한다.

---

#### Editor 내부 상태

편집 중인 제목, 태그, 본문은 `PostEditor` 내부 상태로 관리하다가 저장 시 API로 보낸다.

```ts
type EditorState = {
  title: string;
  summary: string;
  tags: string[];
  bodyMarkdown: string;
};
```

---

## 9. 데이터 보관 방식

### Memory

사용자가 생성 과정 중 임시로 선택하는 정보는 메모리에 둔다.

예:

```txt
선택한 repository
선택한 branch
선택한 commitShas
생성된 초안
```

단, 새로고침하면 사라져도 괜찮은 데이터만 memory에 둔다.

---

### DB

반드시 보존해야 하는 데이터는 DB에 둔다.

```txt
사용자 정보
GitHub 연동 정보
저장된 포스트
포스트 상태
선택된 commit 정보
발행 일시
```

---

### LocalStorage

선택 사항이다.

다음 정도만 저장하는 것을 추천한다.

```txt
마지막으로 선택한 repository
편집 중인 임시 글 자동저장
```

단, GitHub access token은 절대 LocalStorage에 저장하지 않는 것이 좋다.

---

### Session / Cookie

로그인 세션은 httpOnly cookie 기반으로 관리하는 것이 좋다.

```txt
access token: 서버 DB에 암호화 저장
session id: httpOnly cookie
```

---

## 10. 주요 인터랙션 정의

### 1. 저장소 선택

사용자 관점:

```txt
사용자는 GitHub 로그인을 한다.
서비스는 사용자의 repository 목록을 카드 형태로 보여준다.
사용자는 블로그 글로 만들고 싶은 작업이 포함된 repository를 선택한다.
```

완성 조건:

- repository 목록이 정상 표시됨
- private repository 접근 권한이 있으면 표시됨
- 검색 가능
- 선택한 repository가 다음 단계로 전달됨
- API 실패 시 에러 메시지 표시

---

### 2. 브랜치 선택

사용자 관점:

```txt
사용자는 선택한 repository 안의 branch 목록을 본다.
분석하고 싶은 branch를 선택한다.
```

완성 조건:

- 기본 브랜치가 먼저 표시됨
- branch 목록 로딩 상태 표시
- branch 선택 시 commit 목록 자동 갱신
- branch가 없거나 API 실패 시 안내 표시

---

### 3. 커밋 선택

사용자 관점:

```txt
사용자는 최근 commit 목록을 보고 블로그 글에 포함할 commit을 여러 개 선택한다.
각 commit의 메시지, 작성자, 날짜를 확인할 수 있다.
```

완성 조건:

- commit 다중 선택 가능
- 선택 개수 표시
- 최소 1개 이상 선택해야 생성 버튼 활성화
- 너무 많은 commit 선택 시 경고 표시  
  예: “10개 이하의 커밋을 선택하는 것을 권장합니다.”

---

### 4. AI 블로그 생성

사용자 관점:

```txt
사용자는 선택한 commit을 바탕으로 블로그 초안 생성을 요청한다.
서비스는 변경사항을 분석해 제목, 요약, 본문, 태그를 생성한다.
```

완성 조건:

- 생성 중 loading 표시
- 실패 시 재시도 가능
- 결과가 제목/요약/본문/태그 구조로 반환됨
- 코드 변경 내용이 너무 길 경우 backend에서 축약 처리
- AI가 없는 내용을 과장하지 않도록 prompt에 제약 포함

---

### 5. 편집

사용자 관점:

```txt
사용자는 AI가 생성한 초안을 읽고 직접 수정한다.
필요하면 제목, 태그, 본문을 바꾼다.
```

완성 조건:

- Markdown 편집 가능
- 미리보기 가능
- 저장 버튼 제공
- 저장 성공 후 dashboard로 이동하거나 상세 페이지로 이동
- 저장 실패 시 수정 내용이 사라지지 않음

---

### 6. 저장된 글 목록

사용자 관점:

```txt
사용자는 지금까지 생성하고 저장한 글을 카드 형태로 확인한다.
각 카드에서 제목, 요약, 브랜치, 날짜, 상태를 본다.
```

완성 조건:

- 카드형 목록 표시
- 최신순 정렬
- draft/published 상태 표시
- empty state 제공
- 카드 클릭 시 상세 페이지 이동
- 수정 버튼 제공

---

### 7. 수정 및 발행

사용자 관점:

```txt
사용자는 저장된 글을 다시 편집한다.
최종 검토 후 발행 버튼을 누른다.
```

완성 조건:

- 기존 글 내용이 편집기에 로드됨
- 수정 저장 가능
- 발행 전 확인 모달 표시
- 발행 후 status가 published로 변경됨
- publishedAt이 기록됨

---

## 11. AI 생성 설계

### LLM 입력 데이터

```ts
type GeneratePostInput = {
  repository: {
    owner: string;
    name: string;
  };
  branchName: string;
  commits: {
    sha: string;
    message: string;
    authorDate: string;
    files: {
      filename: string;
      status: string;
      additions: number;
      deletions: number;
      patch?: string;
    }[];
  }[];
};
```

---

### LLM 출력 데이터

```ts
type GeneratedPost = {
  title: string;
  summary: string;
  tags: string[];
  bodyMarkdown: string;
};
```

---

### Prompt 방향

AI에게는 다음 조건을 명확히 줘야 한다.

```txt
너는 개발 블로그 초안을 작성하는 도우미다.

다음 commit message와 changed files를 바탕으로 개발 블로그 초안을 작성하라.

조건:
- 실제 변경사항에 근거해서만 작성한다.
- 없는 기능을 만들어내지 않는다.
- 구현 배경, 문제 상황, 해결 방식, 코드 구조 변화, 배운 점을 포함한다.
- 너무 내부적인 commit hash 나열은 피한다.
- Markdown 형식으로 작성한다.
- 독자가 이해할 수 있도록 기술적 맥락을 설명한다.
```

---

### 추천 블로그 구조

```md
# 제목

## 작업 배경

## 구현한 기능

## 주요 변경사항

## 고민한 부분

## 해결 방식

## 배운 점

## 다음 개선 방향
```

---

## 12. 테스트 / 검증 방식

### 구현 완료 조건

이 프로젝트는 다음 조건을 만족하면 MVP 완료로 볼 수 있다.

```txt
1. 사용자가 GitHub로 로그인할 수 있다.
2. 사용자의 repository 목록을 불러올 수 있다.
3. 특정 repository를 선택할 수 있다.
4. branch 목록을 불러올 수 있다.
5. branch를 선택하면 commit 목록을 볼 수 있다.
6. commit을 여러 개 선택할 수 있다.
7. 선택한 commit 기반으로 AI 블로그 초안을 생성할 수 있다.
8. 생성된 초안을 편집할 수 있다.
9. 편집한 글을 draft로 저장할 수 있다.
10. 저장된 글을 카드 목록에서 볼 수 있다.
11. 저장된 글을 다시 수정할 수 있다.
12. 저장된 글을 published 상태로 변경할 수 있다.
```

---

### Frontend 테스트

#### 단위 테스트

도구:

```txt
Vitest
React Testing Library
```

검증 항목:

```txt
RepositoryCard가 repository 정보를 올바르게 렌더링하는가
CommitItem 체크박스가 정상 동작하는가
PostCard에 제목, 요약, 날짜, 상태가 표시되는가
PostEditor에서 입력값 변경이 반영되는가
```

---

### Backend 테스트

#### API 테스트

도구:

```txt
Supertest
Vitest 또는 Jest
```

검증 항목:

```txt
GET /api/posts가 저장된 글 목록을 반환하는가
POST /api/posts가 새 글을 저장하는가
PATCH /api/posts/:id가 글을 수정하는가
PATCH /api/posts/:id/publish가 상태를 published로 바꾸는가
인증되지 않은 사용자는 API에 접근할 수 없는가
```

---

### GitHub API Mock 테스트

GitHub API를 매번 실제 호출하면 테스트가 불안정해진다. 따라서 테스트에서는 mock 데이터를 사용한다.

예:

```ts
const mockCommit = {
  sha: "abc123",
  message: "feat: add GitHub login",
  files: [
    {
      filename: "src/features/auth/GitHubLoginButton.tsx",
      status: "added",
      additions: 50,
      deletions: 0
    }
  ]
};
```

---

### AI 생성 테스트

AI 응답은 매번 다를 수 있으므로 다음을 검증한다.

```txt
응답에 title이 있는가
summary가 비어 있지 않은가
tags가 배열인가
bodyMarkdown이 Markdown 문자열인가
선택한 commit과 무관한 내용을 과도하게 생성하지 않는가
```

Structured Outputs를 사용하면 응답 형태를 JSON Schema로 제한할 수 있으므로, 프론트엔드에서 파싱 실패가 나는 문제를 줄일 수 있다.

---

### E2E 테스트

도구:

```txt
Playwright
```

시나리오:

```txt
1. 로그인된 사용자 상태로 시작
2. repository 선택
3. branch 선택
4. commit 2개 선택
5. AI 생성 버튼 클릭
6. 생성된 글 확인
7. 제목 수정
8. 저장
9. dashboard에서 카드 확인
10. 카드 클릭
11. 다시 편집
12. 발행
13. 상태가 published로 바뀌었는지 확인
```

---

## 13. 우선순위별 개발 계획

### 1단계: 프로젝트 기반 구축

```txt
React + Vite + TypeScript 세팅
Express + TypeScript 세팅
Prisma + PostgreSQL 세팅
공통 타입 정의
라우팅 구조 생성
기본 UI 컴포넌트 생성
```

---

### 2단계: 인증 구현

```txt
GitHub OAuth 로그인
세션 관리
현재 사용자 조회 API
로그아웃
인증 미들웨어
```

---

### 3단계: GitHub 데이터 조회

```txt
Repository 목록 조회
Branch 목록 조회
Commit 목록 조회
Commit 상세 조회
선택 UI 구현
```

---

### 4단계: AI 블로그 생성

```txt
선택한 commitShas backend로 전송
commit detail 수집
diff 데이터 정리
OpenAI API 연동
블로그 초안 JSON 생성
프론트엔드에 결과 표시
```

---

### 5단계: 편집 및 저장

```txt
PostEditor 구현
draft 저장 API
저장된 글 상세 API
수정 API
자동저장 옵션 구현
```

---

### 6단계: 저장된 포스트 목록

```txt
Dashboard 카드 목록
상태 badge
브랜치 태그
요약 미리보기
날짜 표시
상세/수정 이동
```

---

### 7단계: 발행 기능

```txt
발행 확인 모달
status 변경
publishedAt 기록
published 글과 draft 글 구분
```

---

### 8단계: 테스트 및 안정화

```txt
API 테스트
컴포넌트 테스트
AI 응답 schema 검증
E2E 테스트
에러 처리
로딩/빈 상태 처리
```

---

## 14. 최종 추천 MVP 스펙 요약

가장 먼저 만들 버전은 다음 정도가 적절하다.

```txt
GitHub 로그인
Repository 선택
Branch 선택
Commit 다중 선택
AI 블로그 초안 생성
Markdown 편집
Draft 저장
저장 글 카드 목록
저장 글 수정
Published 상태 전환
```

나중에 추가할 기능은 다음으로 미루는 것이 좋다.

```txt
Velog, Medium, Tistory 실제 발행 연동
PR 단위 분석
코드 파일별 상세 해설
이미지 자동 생성
SEO 점수 분석
예약 발행
팀 공유 기능
```
