# 2주차 개발 계획

## 목표

1주차에 만든 화면 흐름을 바탕으로 GitHub API와 LLM API를 연결하고, 선택한 커밋을 개발 블로그 초안으로 변환하는 핵심 기능을 구현한다.

## 이번 주에 할 일

- [ ] Express 서버 구성
- [ ] `.env.example` 작성
- [ ] GitHub Repository 목록 API 연동
- [ ] 브랜치 목록 API 연동
- [ ] 커밋 목록 API 연동
- [ ] 선택한 커밋 정보를 서버로 전달
- [ ] OpenAI API를 사용한 블로그 초안 생성
- [ ] 생성된 초안을 편집기에서 수정 가능하게 만들기
- [ ] 저장된 포스트를 파일 또는 DB에 저장
- [ ] 저장된 포스트 카드 목록 표시
- [ ] 저장된 글 다시 수정하기
- [ ] 발행하기 버튼 UI 구현

## 구현 범위

2주차에는 서비스의 핵심 동작을 완성한다. 단, 실제 외부 블로그 플랫폼 발행은 범위에서 제외하고, 발행 상태를 변경하는 UI와 데이터 흐름까지만 구현한다.

## API 설계 초안

### GitHub API

```txt
GET /api/github/repositories
GET /api/github/repositories/:owner/:repo/branches
GET /api/github/repositories/:owner/:repo/commits?branch=main
```

### AI API

```txt
POST /api/ai/blog-draft
```

요청 데이터:

```js
{
  repository: "rlafurud/commit-to-blog",
  branch: "main",
  commits: [
    {
      sha: "e4f32a0",
      message: "Fix user login bug"
    }
  ]
}
```

### Posts API

```txt
GET /api/posts
POST /api/posts
PATCH /api/posts/:id
PATCH /api/posts/:id/publish
```

## 서버 구조

```txt
server/
  routes/
    github.routes.js
    ai.routes.js
    posts.routes.js
  services/
    github.service.js
    openai.service.js
    post.service.js
  data/
    posts.json
  app.js
```

## 환경변수 관리

`.env` 파일은 커밋하지 않는다.

```txt
GITHUB_TOKEN=
OPENAI_API_KEY=
PORT=3000
```

커밋에는 `.env.example`만 포함한다.

## AI 요약 프롬프트 방향

선택한 커밋을 아래 구조로 정리하도록 요청한다.

```txt
1. 무엇을 변경했는가?
2. 왜 변경했는가?
3. 어떤 문제가 있었는가?
4. 어떻게 해결했는가?
5. 배운 점은 무엇인가?
6. 블로그 제목 후보
```

## 검증 방식

- 저장소 목록이 정상적으로 불러와지는지 확인한다.
- 브랜치 선택 시 커밋 목록이 변경되는지 확인한다.
- 커밋을 선택한 뒤 AI 초안 생성 버튼이 동작하는지 확인한다.
- 생성된 글을 편집기에서 수정할 수 있는지 확인한다.
- 저장한 글이 카드 목록에 표시되는지 확인한다.
- 발행하기 버튼을 누르면 상태가 `published`로 바뀌는지 확인한다.
- API token이 코드나 커밋에 포함되지 않았는지 확인한다.

## 완료 기준

- [ ] GitHub Repository, Branch, Commit 데이터를 서버에서 가져올 수 있다.
- [ ] 선택한 커밋으로 AI 블로그 초안을 생성할 수 있다.
- [ ] 생성된 글을 사용자가 직접 수정할 수 있다.
- [ ] 저장된 글이 카드 목록에 표시된다.
- [ ] 저장된 글을 다시 수정할 수 있다.
- [ ] 발행 상태를 변경할 수 있다.
- [ ] `.env`가 커밋 대상에서 제외되어 있다.
