# API 계약서 초안

## 공통 규약
- Base URL: `/api`
- Content-Type: `application/json; charset=utf-8`
- 인증: MVP에서는 서버 세션 또는 임시 userId 헤더(`x-user-id`) 사용, 추후 OAuth로 대체

성공 응답:
```json
{
  "success": true,
  "data": {}
}
```

실패 응답:
```json
{
  "success": false,
  "error": {
    "code": "INVALID_INPUT",
    "message": "요청 값이 올바르지 않습니다.",
    "details": {}
  }
}
```

## 1) Repos/Commits/Diff

### GET `/repos`
- 설명: 사용자 저장소 목록 조회

`data`:
```json
{
  "repos": [
    {
      "id": 1,
      "owner": "octocat",
      "name": "hello-world",
      "fullName": "octocat/hello-world",
      "private": false,
      "defaultBranch": "main",
      "updatedAt": "2026-05-17T00:00:00.000Z"
    }
  ]
}
```

### GET `/repos/:owner/:repo/commits?perPage=20&cursor=`
- 설명: 특정 저장소 커밋 목록 조회

`data`:
```json
{
  "commits": [
    {
      "sha": "abc123",
      "message": "feat: add interview actions",
      "author": "minja",
      "committedAt": "2026-05-16T12:00:00.000Z"
    }
  ],
  "nextCursor": null
}
```

### GET `/repos/:owner/:repo/commits/:sha/diff`
- 설명: 커밋 diff 조회

`data`:
```json
{
  "repo": "octocat/hello-world",
  "sha": "abc123",
  "stats": { "filesChanged": 2, "additions": 30, "deletions": 4 },
  "files": [
    {
      "path": "src/app.ts",
      "status": "modified",
      "additions": 10,
      "deletions": 2,
      "patch": "@@ -1,3 +1,5 @@ ..."
    }
  ]
}
```

## 2) Interview

### POST `/interviews/start`
- 설명: diff 기반 질문 생성 + 세션 시작

요청:
```json
{
  "repoFullName": "octocat/hello-world",
  "commitSha": "abc123"
}
```

응답 `data`:
```json
{
  "sessionId": "ses_001",
  "status": "READY",
  "currentTurn": {
    "turnId": "turn_001",
    "turnIndex": 0,
    "question": "왜 useEffect 의존성 배열을 비웠나요?",
    "hint": "컴포넌트 마운트 시점과 재렌더링 트리거를 분리해서 생각해보세요.",
    "conceptTags": ["react", "useEffect", "side-effect"]
  }
}
```

### GET `/interviews/:sessionId`
- 설명: 세션/턴 상태 조회

### POST `/interviews/:sessionId/answer`
요청:
```json
{
  "turnId": "turn_001",
  "userAnswer": "초기 1회만 호출하려고 했습니다."
}
```

응답 `data`:
```json
{
  "result": "pass",
  "feedback": "의도는 맞지만 strict mode 재호출도 고려가 필요합니다.",
  "expectedAnswer": "마운트 1회 요청 + 재호출 방지 전략 설명"
}
```

### POST `/interviews/:sessionId/hint`
요청:
```json
{ "turnId": "turn_001" }
```

응답 `data`:
```json
{ "hint": "의존성 배열과 stale closure 리스크를 함께 보세요." }
```

### POST `/interviews/:sessionId/explain`
요청:
```json
{ "turnId": "turn_001" }
```

응답 `data`:
```json
{
  "explanation": "의존성 배열이 비어있으면 마운트 시 1회 실행됩니다...",
  "keyTakeaways": ["렌더 사이클", "idempotent effect"]
}
```

### POST `/interviews/:sessionId/skip`
요청:
```json
{ "turnId": "turn_001" }
```

응답 `data`:
```json
{ "status": "SKIPPED", "next": "DRAFT_MODE" }
```

## 3) Draft/Posts

### POST `/posts/draft`
- 설명: 인터뷰 기록 기반 초안 생성

요청:
```json
{
  "sessionId": "ses_001",
  "mode": "success"
}
```

응답 `data`:
```json
{
  "draftMarkdown": "# 오늘의 커밋 복기\n...",
  "mode": "success",
  "summary": "설계 의도와 트레이드오프를 정리한 초안"
}
```

### POST `/posts`
요청:
```json
{
  "sessionId": "ses_001",
  "title": "useEffect 의존성 배열을 비운 이유",
  "contentMarkdown": "# ...",
  "tags": ["react", "til"],
  "status": "draft"
}
```

### GET `/posts`
- 설명: 사용자 포스트 카드 목록

### GET `/posts/:postId`
- 설명: 포스트 상세 조회

### PATCH `/posts/:postId`
- 설명: 포스트 수정/발행

## 에러 코드
- `INVALID_INPUT` (400)
- `UNAUTHORIZED` (401)
- `FORBIDDEN` (403)
- `NOT_FOUND` (404)
- `GITHUB_API_ERROR` (502)
- `LLM_API_ERROR` (502)
- `LLM_TIMEOUT` (504)
- `INTERNAL_ERROR` (500)
