# Project Structure

이 프로젝트는 GitHub 활동 데이터를 가져와 AI 개발 블로그 초안을 생성하는 MVP 서비스이다.

현재 단계에서는 실제 구현 코드 없이 전체 구조만 만든다. 각 디렉터리는 `github_blog_generator_plan.md`와 `study/github_api_explanation.md`의 흐름을 기준으로 나뉜다.

## Top Level

```txt
client/
  React + TypeScript + Vite frontend

server/
  Express + TypeScript backend

shared/
  frontend/backend에서 함께 참고할 타입과 계약 문서

docs/
  프로젝트 구조, API 흐름, 구현 메모

study/
  학습용 설명 문서
```

## Frontend

```txt
client/src/app/
  App, router, providers, query client

client/src/pages/
  route 단위 page components

client/src/features/auth/
  GitHub OAuth 로그인과 current user 상태

client/src/features/github/
  repository, branch, commit 목록 UI와 API client

client/src/features/post-generator/
  선택한 commit 기반 AI 블로그 생성 flow

client/src/features/posts/
  saved post, draft, publish 상태 관리 UI

client/src/shared/
  공통 UI, 타입, 유틸리티
```

## Backend

```txt
server/src/config/
  env, cors, app configuration

server/src/routes/
  Express route registration

server/src/controllers/
  request/response 처리

server/src/services/
  GitHub API, OpenAI, post generation business logic

server/src/repositories/
  Prisma 기반 DB 접근 계층

server/src/middlewares/
  auth, validation, error handling

server/src/schemas/
  request validation schemas

server/src/types/
  backend domain types

server/src/utils/
  encryption, logger, async handler

server/prisma/
  Prisma schema and migrations
```

## GitHub API Flow

`study/github_api_explanation.md` 기준으로 백엔드가 GitHub API를 호출한다.

```txt
React
  -> Express Backend
  -> GitHub REST API
  -> OpenAI API
  -> PostgreSQL
```

프론트엔드는 GitHub access token을 직접 다루지 않는다.

필요한 GitHub API:

```txt
GET /user
GET /user/repos
GET /repos/{owner}/{repo}/branches
GET /repos/{owner}/{repo}/commits?sha={branch}
GET /repos/{owner}/{repo}/commits/{sha}
```

서비스 내부 API:

```txt
GET  /api/github/repositories
GET  /api/github/repositories/:owner/:repo/branches
GET  /api/github/repositories/:owner/:repo/commits?branch=main
GET  /api/github/repositories/:owner/:repo/commits/:sha
POST /api/post-generator/generate
```

