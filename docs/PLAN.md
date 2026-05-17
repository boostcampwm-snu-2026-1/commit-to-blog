# GitHub 활동 기반 개발 블로그 자동 생성 서비스 — 구현 계획

## 서비스 개요

GitHub 커밋/코드 변경 이력을 분석해 LLM이 블로그 포스트 초안을 자동 작성하고, 사용자가 편집·발행할 수 있는 서비스.

---

## 기술 스택

| 레이어 | 선택 | 이유 |
|--------|------|------|
| Frontend | React + TypeScript | 컴포넌트 재사용, 타입 안전성 |
| Editor | TipTap (ProseMirror 기반) | 리치 텍스트 편집, 마크다운 지원 |
| Backend | Express + TypeScript | GitHub API 프록시, 토큰 은닉 |
| LLM | OpenAI API (GPT-4o) | 코드 분석 품질 |
| DB | SQLite (초기) → PostgreSQL (확장 시) | 포스트 저장 |
| ORM | Prisma | 타입 안전 쿼리 |
| Auth | GitHub OAuth App | 자연스러운 GitHub 연동 |

---

## 아키텍처

```
[Browser / React App]
       │
       │  REST API
       ▼
[Express Server]
  ├── GitHub OAuth 처리
  ├── GitHub API 프록시  ← token은 서버에만 보관
  ├── OpenAI API 호출
  └── 포스트 CRUD (Prisma → DB)
```

GitHub access token은 서버 세션에만 저장하며 클라이언트로 절대 노출하지 않는다.  
모든 GitHub API 호출은 Express 라우터에서만 수행한다.

---

## 구현 단계

### 1주차 — 기반 세팅 & 프론트엔드 UI

| Phase | 내용 |
|-------|------|
| Phase 1 | 프로젝트 초기화, 폴더 구조, 환경변수, ESLint/Prettier |
| Phase 2 | 프론트엔드 페이지 & 컴포넌트 구현 (목업 데이터 기반) |

### 2주차 — 백엔드 연동 & 기능 완성

| Phase | 내용 |
|-------|------|
| Phase 3 | GitHub OAuth 인증 |
| Phase 4 | GitHub API 연동 (서버 프록시) |
| Phase 5 | AI 초안 생성 (OpenAI API) |
| Phase 6 | DB 설계 & 포스트 CRUD |

---

## 주요 기능

### 1. 프론트엔드 UI (1주차)
- **로그인 페이지**: GitHub OAuth 버튼 (2주차에 실제 연동)
- **블로그 생성 페이지**: 저장소/브랜치/커밋 선택 UI, 초안 생성 버튼
- **에디터 페이지**: TipTap 기반 리치 에디터, 툴바, 저장/발행 버튼
- **포스트 목록 페이지**: 카드 그리드, 상태 배지, 에디터 진입

### 2. 인증 & API 연동 (2주차)
- **GitHub OAuth**: access token은 `httpOnly cookie` / `express-session`으로만 관리
- **GitHub API 프록시**: 저장소, 브랜치, 커밋 diff를 서버에서만 조회
- **AI 초안 생성**: 선택 커밋의 diff + 메시지 → OpenAI → 마크다운 초안
- **포스트 CRUD**: `draft` / `published` 상태 관리, 수정 & 발행

---

## API 설계

### 인증
| Method | Path | 설명 |
|--------|------|------|
| GET | `/auth/github` | GitHub OAuth 리다이렉트 |
| GET | `/auth/github/callback` | OAuth 콜백, 세션 저장 |
| POST | `/auth/logout` | 세션 삭제 |

### GitHub 프록시
| Method | Path | 설명 |
|--------|------|------|
| GET | `/api/repos` | 유저 저장소 목록 |
| GET | `/api/repos/:owner/:repo/branches` | 브랜치 목록 |
| GET | `/api/repos/:owner/:repo/commits` | 커밋 로그 (`?sha=<branch>`) |
| GET | `/api/repos/:owner/:repo/commits/:sha` | 커밋 diff 상세 |

### AI 생성
| Method | Path | 설명 |
|--------|------|------|
| POST | `/api/generate` | 선택 커밋 → LLM → 블로그 초안 반환 |

### 포스트 CRUD
| Method | Path | 설명 |
|--------|------|------|
| GET | `/api/posts` | 포스트 목록 |
| GET | `/api/posts/:id` | 포스트 상세 |
| POST | `/api/posts` | 포스트 저장 |
| PUT | `/api/posts/:id` | 포스트 수정 |
| DELETE | `/api/posts/:id` | 포스트 삭제 |

---

## 폴더 구조

```
/
├── client/                   # React 앱
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.tsx
│   │   │   ├── CreateBlog.tsx
│   │   │   ├── Posts.tsx
│   │   │   └── Editor.tsx
│   │   ├── components/
│   │   │   ├── RepoSelector.tsx
│   │   │   ├── CommitList.tsx
│   │   │   ├── PostCard.tsx
│   │   │   └── RichEditor.tsx
│   │   └── api/              # axios 클라이언트 (서버만 호출)
├── server/                   # Express 앱
│   ├── routes/
│   │   ├── auth.ts           # GitHub OAuth
│   │   ├── github.ts         # repo/branch/commit 프록시
│   │   ├── generate.ts       # OpenAI 호출
│   │   └── posts.ts          # CRUD
│   ├── prisma/
│   │   └── schema.prisma
│   └── index.ts
├── .env                      # ← .gitignore에 포함 필수
└── .gitignore
```

---

## 보안 원칙

```
# .env (서버 전용)
GITHUB_CLIENT_ID=xxx
GITHUB_CLIENT_SECRET=xxx
OPENAI_API_KEY=sk-xxx
SESSION_SECRET=xxx
```

```
# .gitignore (필수 항목)
.env
.env.local
node_modules/
```

- `.env`는 절대 커밋하지 않는다
- GitHub token은 서버 세션에서만 관리, 클라이언트 응답에 포함하지 않는다
- 모든 민감 키는 환경변수로만 주입한다
