# Commit to Blog 아키텍처

## 1. 문제 정의
GitHub 활동 데이터를 읽어 개발 과정을 자동으로 요약하고, 편집 가능한 블로그 초안으로 저장하는 서비스를 만든다.

핵심 가치는 두 가지다.
- 개발 로그를 콘텐츠로 변환하는 시간을 줄인다.
- 커밋 히스토리와 실제 코드 변경 맥락을 기반으로 회고 품질을 높인다.

## 2. 구현 범위

### 포함
- 저장소 목록 조회
- 브랜치 조회
- 특정 브랜치의 커밋 목록 조회
- 여러 커밋 선택
- 선택한 커밋 diff 기반 AI 블로그 초안 생성
- 마크다운 편집
- 저장된 포스트 목록 조회
- 상세 수정
- 발행 상태 변경

### 제외
- GitHub OAuth 로그인
- 외부 블로그 플랫폼 실제 배포 연동
- 다중 사용자 계정 시스템
- 댓글, 좋아요 등 커뮤니티 기능

## 3. 기술 선택

### Frontend
- React + TypeScript + Vite
  - 2주 범위에서 빠르게 화면을 구성하고, 타입으로 API 계약을 관리하기 좋다.
  - Vite 는 초기 세팅이 가볍고 개발 서버 속도가 빠르다.

### Backend
- Express + TypeScript
  - 요구사항에서 GitHub API 를 Express 기반 서버에서 호출하도록 명시했다.
  - 라우팅과 서비스 계층을 직접 설계하기 쉬워 학습 목적에 잘 맞는다.

### Storage
- SQLite + `better-sqlite3`
  - 저장된 포스트 기능에는 메모리보다 영속 저장이 필요하다.
  - 설치와 관리 비용이 낮고 로컬 과제 프로젝트에 적합하다.

### AI 연동
- OpenAI API
  - 커밋 메시지, 파일 변경 요약, patch 일부를 묶어 블로그 초안을 생성한다.
  - 키가 없을 때는 데모 생성기로 폴백해 화면과 저장 흐름을 검증할 수 있게 한다.

## 4. 데이터 구조

### RepositorySummary
- `owner`
- `name`
- `fullName`
- `description`
- `defaultBranch`
- `updatedAt`
- `isPrivate`

### BranchSummary
- `name`
- `protected`
- `commitSha`

### CommitSummary
- `sha`
- `message`
- `authorName`
- `committedAt`
- `url`

### Post
- `id`
- `repositoryOwner`
- `repositoryName`
- `branch`
- `commitShas`
- `sourceCommits`
- `title`
- `summary`
- `content`
- `status`
- `generationMode`
- `createdAt`
- `updatedAt`
- `publishedAt`

## 5. 컴포넌트 구조

### React 디렉토리 구조
```text
apps/web/src
├── api
├── components
├── layouts
├── pages
└── main.tsx
```

### 주요 화면
- `CreateBlogPage`
  - 저장소 선택
  - 브랜치 선택
  - 커밋 다중 선택
  - 블로그 생성 요청
- `SavedPostsPage`
  - 카드형 목록
  - 상태, 브랜치, 날짜, 요약 미리보기
- `PostEditorPage`
  - 제목/요약/본문 편집
  - 마크다운 미리보기
  - 발행 처리

## 6. Express 디렉토리 구조
```text
apps/server/src
├── config
├── database
├── lib
├── modules
│   ├── blog
│   ├── github
│   └── posts
└── routes
```

### 역할
- `modules/github`
  - GitHub API 호출과 데모 데이터 폴백
- `modules/blog`
  - 선택한 커밋을 프롬프트용 입력으로 가공
  - OpenAI 호출 또는 로컬 초안 생성
- `modules/posts`
  - SQLite CRUD

## 7. 상태 흐름
1. 프론트에서 저장소 목록 요청
2. 선택된 저장소 기준으로 브랜치 요청
3. 선택된 브랜치 기준으로 커밋 목록 요청
4. 사용자가 여러 커밋을 선택해 초안 생성 요청
5. 서버가 GitHub commit detail 과 diff 요약을 수집
6. 서버가 OpenAI 에 초안 생성을 요청
7. 생성 결과를 SQLite 에 draft 로 저장
8. 프론트는 저장된 draft 상세 화면으로 이동
9. 사용자가 편집 후 저장 또는 발행

## 8. 데이터 보관 전략
- 포스트는 SQLite 에 저장한다.
- API 키는 `.env` 에 보관하고 Git 에 커밋하지 않는다.
- GitHub 와 OpenAI 토큰이 없으면 데모 모드로 전환한다.

## 9. 주요 인터랙션
- 사용자는 저장소와 브랜치를 바꿀 때마다 관련 목록이 새로 갱신된다.
- 생성 버튼은 최소 1개 이상의 커밋을 선택했을 때만 활성화된다.
- 생성 완료 후 즉시 편집 화면으로 이동한다.
- 저장된 포스트는 카드에서 바로 열 수 있다.
- 발행된 글은 상태 태그와 발행일로 구분된다.

## 10. 테스트와 검증

### 구현 완료 기준
- 저장소 선택부터 draft 저장까지 흐름이 끊기지 않는다.
- 저장된 포스트를 수정하고 발행할 수 있다.
- 타입체크가 통과한다.
- 데모 모드에서 핵심 UI 를 확인할 수 있다.

### 검증 방식
- `npm run check`
- GitHub/OpenAI 키 없이 데모 데이터로 동작 확인
- 키가 있을 때 실제 저장소 목록과 커밋 조회 확인
- 블로그 생성 후 편집/발행 상태 전환 확인

