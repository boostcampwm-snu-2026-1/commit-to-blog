# GitHub API Integration

## Goal

GitHub Repository, Branch, Commit, Commit Detail 데이터를 Express 서버에서 조회하고 React 클라이언트에는 정규화된 데이터만 전달한다. GitHub token은 서버 `.env`에만 존재해야 한다.

## Environment

`.env.example`에 필요한 변수 이름만 기록한다.

```txt
PORT=3001
CLIENT_ORIGIN=http://localhost:5173
GITHUB_TOKEN=
```

실제 값은 `.env`에만 작성하고 커밋하지 않는다.

## Server Routes

### `GET /api/github/repositories`

사용자의 Repository 목록을 반환한다.

```json
{
  "repositories": [
    {
      "id": "123",
      "name": "commit-to-blog",
      "fullName": "motoo42/commit-to-blog",
      "description": null,
      "defaultBranch": "main",
      "htmlUrl": "https://github.com/motoo42/commit-to-blog",
      "visibility": "public"
    }
  ]
}
```

### `GET /api/github/repositories/:owner/:repo/branches`

선택한 Repository의 Branch 목록을 반환한다.

```json
{
  "branches": [
    {
      "name": "main",
      "sha": "commit-sha",
      "protected": false
    }
  ]
}
```

### `GET /api/github/repositories/:owner/:repo/commits?branch={branch}`

선택한 Branch의 Commit 목록을 반환한다. `branch` query가 없으면 `400 BRANCH_REQUIRED`를 반환한다.

```json
{
  "commits": [
    {
      "sha": "commit-sha",
      "message": "commit message",
      "authorName": "motoo42",
      "authorDate": "2026-05-18T00:00:00Z",
      "htmlUrl": "https://github.com/..."
    }
  ]
}
```

### `GET /api/github/repositories/:owner/:repo/commits/:sha`

선택한 Commit의 상세 정보와 변경 파일 정보를 반환한다. 긴 patch는 `patchSummary`로 제한된다.

```json
{
  "commit": {
    "sha": "commit-sha",
    "message": "commit message",
    "authorName": "motoo42",
    "authorDate": "2026-05-18T00:00:00Z",
    "htmlUrl": "https://github.com/...",
    "changedFiles": [
      {
        "filename": "src/App.tsx",
        "status": "modified",
        "additions": 10,
        "deletions": 2,
        "patchSummary": "@@ ..."
      }
    ]
  }
}
```

## Error Policy

- `GITHUB_TOKEN_MISSING`: 서버에 `GITHUB_TOKEN`이 설정되지 않았다.
- `GITHUB_UNAUTHORIZED`: token이 없거나 유효하지 않다.
- `GITHUB_FORBIDDEN`: 권한이 없거나 rate limit에 걸렸다.
- `GITHUB_NOT_FOUND`: Repository, Branch, Commit을 찾을 수 없다.
- `GITHUB_REQUEST_FAILED`: 그 외 GitHub 요청 실패.

서버는 token 값, authorization header, private diff 원문을 응답이나 로그에 남기지 않는다.

## Verification

- `GITHUB_TOKEN`은 `server/config/env.ts`에서만 읽는다.
- GitHub API 요청은 `server/services/githubService.ts`에 모은다.
- React 클라이언트는 이후 `/api/github/*` 라우트만 호출한다.
- `.env`는 `.gitignore`에 포함한다.
