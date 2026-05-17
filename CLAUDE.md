# commit-to-blog: Smart Blog Service

## Project Overview
GitHub 활동 데이터를 분석해 자동으로 개발 블로그를 생성하는 서비스.
선택한 저장소의 커밋 로그와 코드 변경 사항을 LLM으로 분석하여 블로그 초안을 자동 생성하고, 사용자가 편집·발행할 수 있다.

## Tech Stack

### Frontend
- React 18 + Vite (빠른 빌드, HMR, modern DX)
- React Router v6 (SPA routing)
- TailwindCSS (utility-first, 빠른 UI 구성)
- Axios (HTTP client, /api proxy to backend)
- TypeScript (type safety)

### Backend
- Node.js + Express 5 (simple, flexible REST API)
- @octokit/rest (GitHub API client)
- better-sqlite3 (lightweight embedded DB, no separate server needed)
- @anthropic-ai/sdk (LLM: claude-haiku-4-5)
- dotenv (env management)
- cors (cross-origin for dev)

### Why this stack?
- Vite over CRA: 10x faster build, native ESM HMR
- SQLite over PostgreSQL: zero config for MVP, easy file backup, single-user app
- Claude Haiku over GPT-3.5: better Korean output, lower latency, cost-efficient
- TailwindCSS over styled-components: no runtime overhead, consistent design tokens

## Architecture

```
Frontend (React:5173)
    ↕ Axios /api/*
Backend (Express:3001)
    ├── /api/github/* → GitHub REST API (via Octokit, server-side token)
    ├── /api/blog/generate → Anthropic Claude API
    └── /api/posts/* → SQLite (posts.db)
```

## Directory Structure

```
commit-to-blog/
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── PostsListPage.tsx   # 저장된 포스트 카드 목록
│   │   │   ├── CreatePostPage.tsx  # 블로그 생성 위자드
│   │   │   └── EditPostPage.tsx    # 편집 + 발행
│   │   ├── components/
│   │   │   ├── PostCard.tsx
│   │   │   ├── RepoSelector.tsx
│   │   │   ├── BranchSelector.tsx
│   │   │   ├── CommitList.tsx      # 다중 선택
│   │   │   ├── BlogEditor.tsx      # 마크다운 편집기
│   │   │   └── Header.tsx
│   │   ├── api/
│   │   │   ├── github.ts
│   │   │   └── posts.ts
│   │   └── types/index.ts
│   ├── vite.config.ts
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   │   ├── github.js
│   │   │   ├── posts.js
│   │   │   └── blog.js
│   │   ├── services/
│   │   │   ├── githubService.js
│   │   │   ├── llmService.js
│   │   │   └── dbService.js
│   │   ├── middleware/
│   │   │   └── errorHandler.js
│   │   └── index.js
│   ├── .env.example
│   └── package.json
├── docs/
│   └── DESIGN.md
├── .claude/
│   └── skills/
│       └── blog-from-commits.md
├── CLAUDE.md
├── week1-plan.md
└── week2-plan.md
```

## Development Workflow (AI-Assisted)

1. **Plan**: 요구사항 분석 → 주차별 목표 설정 → CLAUDE.md 업데이트
2. **Design**: 데이터 구조 + API + 컴포넌트 구조 정의 → docs/DESIGN.md
3. **Implement**: 백엔드 우선 (API-first), 프론트엔드 연결
4. **Verify**: 수동 테스트 시나리오 실행 → 버그 수정

## Key Commands

```bash
# Backend
cd backend && npm install
cp .env.example .env  # fill in tokens
npm run dev           # nodemon on port 3001

# Frontend  
cd frontend && npm install
npm run dev           # Vite on port 5173
```

## Environment Variables

See backend/.env.example:
- GITHUB_TOKEN - GitHub Personal Access Token (repo, read:user scope)
- ANTHROPIC_API_KEY - Anthropic API key
- PORT - Backend port (default: 3001)
- FRONTEND_URL - CORS origin (default: http://localhost:5173)

## Security Rules
- API tokens NEVER stored in frontend code or committed to git
- .env listed in .gitignore
- All GitHub API requests proxied through Express server

## AI Workflow

This project uses Claude Code team agents:
- /oh-my-claudecode:team - Multi-agent parallel development
- /blog-from-commits skill - Encapsulates LLM blog generation pattern
- Stage pipeline: team-plan → team-exec → team-verify

## Custom Skill

.claude/skills/blog-from-commits.md - Reusable skill for the core blog generation pattern.
Trigger with: /blog-from-commits
