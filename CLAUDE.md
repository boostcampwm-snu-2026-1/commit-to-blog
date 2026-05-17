# CLAUDE.md

## 기술 스택

- Frontend: React + TypeScript + Vite + Tailwind CSS
- Backend: Express + MongoDB Atlas
- AI: OpenAI API
- External API: GitHub API (GraphQL)
- Linter: Biome

## 디렉토리 구조

```
smart-blog/
├── client/
│   └── src/
│       ├── components/
│       ├── hooks/
│       ├── api/
│       └── pages/
├── server/
│   └── src/
│       ├── routes/
│       ├── controllers/
│       ├── models/
│       └── services/
├── docs/
└── .claude/
    └── commands/
```

## 코딩 컨벤션

### Frontend

- `type`으로 통일 (`interface`와 혼용 금지)
- `import type` 필수 (verbatimModuleSyntax)
- 함수형 컴포넌트만 사용
- 커스텀 훅으로 비즈니스 로직 분리
- App.tsx는 구조 셸 역할만

### Backend

- Layered Architecture: routes → controllers → services → models
- 환경변수는 .env로 관리, 절대 커밋 금지