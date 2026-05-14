# 1주차 개발 계획

## 목표

`commit-to-blog` 서비스의 기능 범위와 화면 구조를 구체화하고, 실제 API 연동 전 mock 데이터 기반으로 핵심 화면 흐름을 만든다.

## 이번 주에 할 일

- [ ] 서비스 핵심 기능 정의
- [ ] GitHub 저장소, 브랜치, 커밋, 블로그 포스트 데이터 구조 정의
- [ ] React 기반 화면/컴포넌트 구조 설계
- [ ] Express 기반 서버 디렉토리 구조 설계
- [ ] GitHub Repository 선택 화면 만들기
- [ ] 브랜치 선택 UI 만들기
- [ ] 커밋 목록 선택 UI 만들기
- [ ] AI 블로그 초안 편집기 UI 만들기
- [ ] 저장된 포스트 카드 목록 UI 만들기
- [ ] mock 데이터로 전체 화면 흐름 연결

## 구현 범위

1주차에는 실제 GitHub API와 OpenAI API를 연결하지 않는다. 먼저 사용자가 어떤 순서로 저장소, 브랜치, 커밋을 선택하고 글을 생성하는지 화면 흐름을 완성한다.

## 데이터 구조 초안

### Repository

```js
{
  id: 1,
  name: "commit-to-blog",
  owner: "rlafurud",
  fullName: "rlafurud/commit-to-blog"
}
```

### Branch

```js
{
  name: "main",
  commitSha: "abc123"
}
```

### Commit

```js
{
  sha: "e4f32a0",
  message: "Fix user login bug",
  author: "rlafurud",
  date: "2026-05-14"
}
```

### BlogPost

```js
{
  id: "post-1",
  title: "Fix user login bug",
  branch: "main",
  commits: ["e4f32a0"],
  summary: "로그인 버그 수정 과정을 정리했습니다.",
  content: "블로그 본문...",
  createdAt: "2026-05-14",
  status: "draft"
}
```

## 화면 구조

- `CreateBlogPage`: 블로그 생성 화면
- `SavedPostsPage`: 저장된 포스트 목록 화면
- `RepositorySelector`: 저장소 선택
- `BranchSelector`: 브랜치 선택
- `CommitList`: 커밋 목록 선택
- `BlogEditor`: AI 초안 확인 및 수정
- `SavedPostCard`: 저장된 글 카드

## 상태 흐름

1. 사용자가 저장소를 선택한다.
2. 선택한 저장소에 맞는 브랜치 목록을 보여준다.
3. 브랜치를 선택하면 커밋 목록을 보여준다.
4. 사용자가 커밋을 선택한다.
5. 선택한 커밋을 기반으로 블로그 초안 영역을 보여준다.
6. 사용자가 글을 수정하고 저장한다.
7. 저장된 글은 카드 목록에서 확인한다.

## AI Workflow

- 기능을 작은 단위로 나눈다.
- 데이터 구조를 먼저 정리한다.
- mock 데이터로 화면을 먼저 만든다.
- 화면 흐름이 맞는지 확인한 뒤 실제 API 연동으로 교체한다.
- 구현 후 체크리스트 기준으로 동작을 검증한다.

## 완료 기준

- [ ] 주차별 계획 문서가 있다.
- [ ] 데이터 구조 초안이 정리되어 있다.
- [ ] 화면/컴포넌트 구조가 정리되어 있다.
- [ ] mock 데이터로 저장소, 브랜치, 커밋, 포스트 화면을 확인할 수 있다.
- [ ] 2주차에 API 연동으로 교체할 지점이 명확하다.
