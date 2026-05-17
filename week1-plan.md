# Week 1 Plan: 기획 구체화 & 설계 (2026-05-18 ~ 2026-05-24)

## 목표
요구사항을 완전히 이해하고, 기술 스택을 선정하며, 설계 문서를 완성한다.
프로젝트 구조를 잡고 GitHub API 연동 방식을 확정한다.

## 완료 기준 (Definition of Done)

- [ ] CLAUDE.md 작성 완료 (프로젝트 개요, 기술 스택, 디렉토리 구조, AI workflow)
- [ ] docs/DESIGN.md 작성 완료 (데이터 구조, API 명세, 컴포넌트 구조, 상태 흐름)
- [ ] week1-plan.md, week2-plan.md 작성 및 커밋
- [ ] frontend/ 디렉토리 스캐폴딩 (package.json, Vite 설정, 컴포넌트 skeleton)
- [ ] backend/ 디렉토리 스캐폴딩 (package.json, Express 구조, routes, services)
- [ ] backend/.env.example 작성
- [ ] .gitignore에 .env, node_modules, *.db 포함
- [ ] .claude/skills/blog-from-commits.md 커스텀 스킬 작성
- [ ] AI Workflow 정의 완료 (CLAUDE.md에 문서화)

## 기술 스택 선택 근거

| 분류 | 선택 | 이유 |
|------|------|------|
| Frontend Framework | React 18 + Vite | 빠른 HMR, modern ESM, 광범위한 생태계 |
| UI Styling | TailwindCSS | 런타임 오버헤드 없음, 빠른 프로토타이핑 |
| Routing | React Router v6 | SPA에 최적화, 간단한 API |
| Backend | Express.js | 경량, 유연, Node.js 생태계 |
| Database | SQLite (better-sqlite3) | 설치 불필요, 파일 기반, MVP에 최적 |
| LLM | Anthropic Claude Haiku | 한국어 강함, 저렴한 비용, 빠른 응답 |
| GitHub API | @octokit/rest | 공식 클라이언트, 타입 지원 |

## 데이터 구조 요약

Post: { id, title, body, summary, repo_name, branch, commits[], created_at, updated_at, published }
Repository: { id, name, fullName, description, defaultBranch, private }
CommitRef: { sha, message, author, date }

## 컴포넌트 구조 요약

- PostsListPage: 저장된 포스트 카드 목록
- CreatePostPage: 4단계 위자드 (저장소 → 브랜치 → 커밋 선택 → AI 생성 + 편집)
- EditPostPage: 기존 포스트 편집 + 발행

## API 설계 요약

- GET /api/github/repos → 저장소 목록
- GET /api/github/repos/:owner/:repo/branches → 브랜치 목록
- GET /api/github/repos/:owner/:repo/commits?branch=X → 커밋 목록
- POST /api/blog/generate → LLM 블로그 초안 생성
- GET|POST|PUT|DELETE /api/posts → 포스트 CRUD

## AI Workflow (1주차)

```
1. 요구사항 분석 (/team 에이전트로 병렬 작업)
2. 기술 스택 결정 → CLAUDE.md 기록
3. 설계 (DESIGN.md)
4. 스캐폴딩 (백엔드 + 프론트엔드 기본 구조)
5. 검증 (디렉토리 구조 확인, package.json 유효성)
```

## 보안 체크리스트

- [ ] .gitignore에 .env 포함 확인
- [ ] .env.example에 실제 토큰 값 없음
- [ ] GITHUB_TOKEN, ANTHROPIC_API_KEY는 backend .env에만 저장
- [ ] 프론트엔드 코드에 토큰 하드코딩 없음

## 위험 요소 & 대응

| 위험 | 대응 |
|------|------|
| GitHub OAuth 복잡성 | MVP는 PAT(Personal Access Token) 방식 사용 |
| better-sqlite3 빌드 실패 | node-gyp 설치, 또는 sql.js 대체 검토 |
| LLM 응답 지연 (>5초) | 로딩 스피너 + 타임아웃 처리 |

## 1주차 검증 방법

```bash
# 프로젝트 구조 확인
ls commit-to-blog/frontend/src/
ls commit-to-blog/backend/src/

# 백엔드 기동 (토큰 설정 후)
cd backend && npm install && npm run dev

# GitHub API 연동 테스트
curl http://localhost:3001/api/github/repos
```
