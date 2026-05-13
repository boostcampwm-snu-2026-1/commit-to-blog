# API 명세 (REST)

> 클라이언트 ↔ Express 서버 계약.
> 응답 본문 타입은 `packages/shared/src/types/` 의 정의를 따른다.

---

## 공통

- **Base URL**: `/api`
- **요청/응답 포맷**: `application/json; charset=utf-8`
- **에러 응답 (모든 4xx/5xx)**

```json
{
  "error": {
    "code": "GITHUB_AUTH_FAILED",
    "message": "GitHub 토큰이 유효하지 않습니다.",
    "details": { "status": 401 }
  }
}
```

| 에러 코드 | HTTP | 의미 |
|---|---|---|
| `BAD_REQUEST` | 400 | 입력 검증 실패 (Zod) |
| `NOT_FOUND` | 404 | 리소스 없음 |
| `GITHUB_AUTH_FAILED` | 401 | GitHub 토큰 누락/만료 |
| `GITHUB_RATE_LIMITED` | 429 | GitHub Rate Limit |
| `LLM_FAILED` | 502 | OpenAI 호출 실패 |
| `LLM_CONTEXT_TOO_LARGE` | 413 | diff 가 토큰 한도 초과 |
| `INTERNAL_ERROR` | 500 | 그 외 |

---

## Health

### `GET /healthz`

```jsonc
// 200
{ "ok": true, "version": "0.1.0", "uptimeMs": 12345 }
```

---

## Repositories

### `GET /api/repos?q={search}`

토큰 소유자(`viewer`)의 저장소 목록. `q` 가 있으면 이름 부분 일치 필터.

```jsonc
// 200
{
  "repos": [
    {
      "id": "MDEwOlJlcG9zaXRvcnk...",
      "fullName": "jj1kim/commit-to-blog",
      "name": "commit-to-blog",
      "owner": { "login": "jj1kim", "avatarUrl": "https://..." },
      "defaultBranch": "main",
      "description": "스마트블로그 — week11/12",
      "updatedAt": "2026-05-13T11:42:09Z"
    }
  ]
}
```

### `GET /api/repos/:owner/:repo/branches`

```jsonc
// 200
{
  "branches": [
    { "name": "main", "isDefault": true, "headSha": "abc1234..." },
    { "name": "feature/week11", "isDefault": false, "headSha": "def5678..." }
  ]
}
```

### `GET /api/repos/:owner/:repo/commits?branch={name}&limit={n}`

- `limit` 기본 20, 최대 50.

```jsonc
// 200
{
  "commits": [
    {
      "sha": "abc1234...",
      "shortSha": "abc1234",
      "message": "Fix user login bug",
      "author": { "name": "jj1kim", "login": "jj1kim", "avatarUrl": "https://..." },
      "committedAt": "2026-05-13T08:15:42Z"
    }
  ]
}
```

---

## Drafts (LLM)

### `POST /api/posts/draft`

```jsonc
// 요청
{
  "repoFullName": "jj1kim/commit-to-blog",
  "branch": "main",
  "commitShas": ["abc1234..."]
}
```

```jsonc
// 200
{
  "draft": {
    "contextKey": "sha256-...",
    "repoFullName": "jj1kim/commit-to-blog",
    "branch": "main",
    "commitShas": ["abc1234..."],
    "title": "사용자 로그인 버그 수정",
    "body": "# ...\n## 변경 사항\n- 세션 만료 시간을 30분 → 2시간으로...",
    "summary": "세션 타임아웃 문제를 해결한 변경 사항을 정리합니다.",
    "generatedAt": "2026-05-13T12:00:00.000Z",
    "model": "gpt-4o-mini"
  }
}
```

**실패 응답**: `LLM_FAILED`, `LLM_CONTEXT_TOO_LARGE`

---

## Posts (저장된 글)

### `GET /api/posts?status={draft|published|all}`

`status` 기본 `all`.

```jsonc
// 200
{
  "posts": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "title": "Refactoring Auth Module",
      "body": "...",
      "summary": "인증 모듈을 가독성 높이기 위해...",
      "source": {
        "repoFullName": "jj1kim/commit-to-blog",
        "branch": "main",
        "commitShas": ["abc1234"]
      },
      "status": "draft",
      "createdAt": "2026-05-21T03:00:00.000Z",
      "updatedAt": "2026-05-21T03:00:00.000Z",
      "publishedAt": null
    }
  ]
}
```

### `POST /api/posts`

```jsonc
// 요청
{
  "title": "사용자 로그인 버그 수정",
  "body": "# ...",
  "summary": "세션 타임아웃 문제를...",
  "source": {
    "repoFullName": "jj1kim/commit-to-blog",
    "branch": "main",
    "commitShas": ["abc1234"]
  }
}
```

```jsonc
// 201
{ "post": { "id": "...", "...": "..." } }
```

### `GET /api/posts/:id`

```jsonc
// 200
{ "post": { "...": "..." } }
// 404 NOT_FOUND
```

### `PUT /api/posts/:id`

```jsonc
// 요청 (부분 갱신 허용)
{ "title": "...", "body": "...", "summary": "..." }
// 200
{ "post": { "...": "..." } }
```

### `PATCH /api/posts/:id/publish`

```jsonc
// 요청
{ "publish": true }  // false 면 draft 로 되돌리기
// 200
{ "post": { "status": "published", "publishedAt": "..." } }
```

### `DELETE /api/posts/:id`

```jsonc
// 204 (no content)
```

---

## 검증 (Zod 스키마 위치)

서버 라우트별로 `routes/<domain>.ts` 안에 `z.object({...})` 를 정의하고 `parse()` 로 검증.

예시:

```ts
// routes/drafts.ts
const CreateDraftBody = z.object({
  repoFullName: z.string().regex(/^[^/]+\/[^/]+$/),
  branch: z.string().min(1),
  commitShas: z.array(z.string().regex(/^[a-f0-9]{7,40}$/)).min(1),
});
```

---

## 페이지네이션

- 11~12주차에는 페이지네이션 미도입.
- `GET /api/repos`, `GET /api/posts` 둘 다 단순 배열 반환.
- 12주차 후반에 필요해지면 `?cursor=` 기반으로 추가 (Should 항목 아님 — Could 수준).

---

## CORS

- dev 환경: 클라이언트가 Vite proxy (`/api`) 로 same-origin 호출.
- 별도 CORS 미들웨어 불필요.
- production 가정 시 서버가 정적 파일도 함께 서빙 (`apps/server/dist/public/`) → 동일 origin 유지.
