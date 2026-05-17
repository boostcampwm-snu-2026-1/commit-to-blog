commit-to-blog/
├── client/ (Vite + React + TS)
│   ├── src/
│   │   ├── components/ (UI 컴포넌트: RepoSelector, CommitList, Editor 등)
│   │   ├── context/ (상태 관리: AuthContext, PostContext)
│   │   ├── hooks/ (커스텀 훅: useFetch, useGitHub)
│   │   ├── styles/ (Global CSS & CSS Modules)
│   │   ├── types/ (Strict TypeScript Interfaces)
│   │   └── App.tsx
│   ├── index.html
│   └── vite.config.ts
├── server/ (Express + Node.js)
│   ├── data/
│   │   └── posts.json (로컬 DB 역할)
│   ├── routes/
│   │   ├── github.ts (GitHub API 관련)
│   │   ├── blog.ts (OpenAI API 관련)
│   │   └── posts.ts (파일 I/O 관련)
│   ├── utils/
│   │   └── githubClient.ts (Octokit 또는 Native fetch 로직)
│   ├── .env (PAT, OpenAI Key 보관 - Git 제외)
│   └── index.ts (Express 진입점)
├── docs/ (GEMINI.md, design.md, checklist.md)
└── package.json
