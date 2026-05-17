# commit-to-blog

GitHub 커밋/코드 변경 이력을 AI가 분석해 자동으로 개발 블로그 초안을 생성하는 서비스.

## Tech Stack

- **Framework**: Next.js 14 (App Router, TypeScript, `src/` 디렉터리)
- **Database**: MongoDB Atlas Free Tier — Mongoose ODM
- **LLM**: Google Gemini 1.5 Flash (`@google/generative-ai`)
- **Auth**: GitHub Personal Access Token (PAT) — sessionStorage 보관, MVP. 추후 GitHub OAuth 업그레이드 예정
- **Styling**: Tailwind CSS + shadcn/ui
- **Markdown Editor**: `@uiw/react-md-editor` (SSR 불가 — 반드시 `dynamic` + `ssr: false` 사용)
- **Deployment**: Vercel (GitHub 연동 후 `main` push 시 자동 배포)

## Development Commands

```bash
npm run dev      # 개발 서버 (http://localhost:3000)
npm run build    # 프로덕션 빌드
npm run lint     # ESLint
```

## Project Setup (첫 실행 시)

```bash
# 1. Next.js 초기화
npx create-next-app@14 . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

# 2. shadcn/ui 설정
npx shadcn@latest init
npx shadcn@latest add button card badge input label progress skeleton toast

# 3. 추가 의존성
npm install mongoose @google/generative-ai @uiw/react-md-editor date-fns
```

## Environment Variables (`.env.local`)

```
MONGODB_URI=mongodb+srv://<user>:<pw>@cluster0.xxxxx.mongodb.net/commit-to-blog
GEMINI_API_KEY=AIza...
```

> `.env.local`은 절대 커밋하지 않는다. PAT는 환경 변수로 관리하지 않고, 사용자가 런타임에 입력한다.

## Directory Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout — NavBar, Toaster 포함
│   ├── page.tsx                # / → /posts 리다이렉트
│   ├── new/page.tsx            # 블로그 생성 위저드 (7단계)
│   ├── posts/
│   │   ├── page.tsx            # 저장된 포스트 카드 그리드
│   │   └── [id]/page.tsx       # 포스트 편집/발행
│   └── api/
│       ├── github/
│       │   ├── validate/       # PAT 검증 + 유저 정보
│       │   ├── repos/          # 저장소 목록
│       │   ├── branches/       # 브랜치 목록
│       │   ├── commits/        # 커밋 목록 (최근 30개)
│       │   └── diff/           # 커밋 diff (6000자/커밋 truncate)
│       ├── generate/           # Gemini 블로그 초안 생성
│       └── posts/              # 포스트 CRUD
│           └── [id]/
├── components/
│   ├── ui/                     # shadcn 자동 생성 — 직접 수정 금지
│   ├── wizard/                 # 생성 위저드 단계별 컴포넌트
│   ├── posts/                  # PostCard, PostGrid, PostCardSkeleton
│   └── shared/                 # MarkdownEditor, NavBar
├── lib/
│   ├── mongodb.ts              # 커넥션 싱글톤 (global 캐싱)
│   ├── github.ts               # GitHub REST API 헬퍼
│   ├── gemini.ts               # Gemini 클라이언트 + 프롬프트 템플릿
│   └── utils.ts                # cn() helper
├── models/
│   └── Post.ts                 # Mongoose 스키마
├── hooks/
│   ├── useWizardState.ts       # useReducer — 위저드 전역 상태
│   └── usePat.ts               # sessionStorage PAT read/write
└── types/
    └── index.ts                # 공유 TypeScript 인터페이스
```

## Key Patterns

### PAT 보안 플로우
```
클라이언트 sessionStorage
    → x-github-pat 헤더
    → Next.js API Route (서버, PAT가 메모리에만 존재)
    → GitHub API
```
PAT는 DB에 저장하거나 응답 바디에 포함해선 안 된다.

### MongoDB 연결 싱글톤
Next.js hot reload 시 연결이 중복되지 않도록 `global` 객체에 캐싱한다.
```typescript
// src/lib/mongodb.ts
declare global { var mongoose: { conn: ...; promise: ... } }
```

### MarkdownEditor SSR 처리
`@uiw/react-md-editor`는 `window`/`navigator`에 의존한다.
```typescript
// src/components/shared/MarkdownEditor.tsx
'use client'
const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false })
```

### Gemini 토큰 관리
커밋당 diff를 6000자, 전체 payload를 20000자로 truncate해 무료 티어를 초과하지 않는다.
응답의 첫 `# ` 줄을 파싱해 포스트 제목으로 자동 채운다.

### 위저드 상태 관리
`useReducer`를 `/new/page.tsx`에 colocate한다. Context나 외부 상태 라이브러리 불필요.

## Data Model

```typescript
// src/models/Post.ts
{
  title: string           // required
  content: string         // 전체 마크다운
  repoFullName: string    // "owner/repo"
  branch: string
  selectedShas: string[]  // 생성에 사용된 커밋 SHA 목록
  published: boolean      // default: false
  createdAt: Date         // timestamps: true
  updatedAt: Date
}
```

## API Routes

| Route | Method | 설명 |
|---|---|---|
| `/api/github/validate` | GET | PAT 검증, 유저 정보 반환 |
| `/api/github/repos` | GET | 저장소 목록 |
| `/api/github/branches` | GET | ?owner=&repo= |
| `/api/github/commits` | GET | ?owner=&repo=&branch= |
| `/api/github/diff` | GET | ?owner=&repo=&shas=sha1,sha2 |
| `/api/generate` | POST | Gemini로 블로그 초안 생성 |
| `/api/posts` | GET / POST | 목록 조회 / 포스트 생성 |
| `/api/posts/[id]` | GET / PUT / DELETE | 개별 포스트 조작 |

모든 GitHub API 라우트는 요청 헤더 `x-github-pat`에서 PAT를 읽는다.

## Deployment (Vercel)

1. vercel.com에서 GitHub 저장소 연결
2. 환경 변수 `MONGODB_URI`, `GEMINI_API_KEY` 입력
3. Deploy — 이후 `main` push 시 자동 재배포

## MongoDB Atlas 설정 주의사항

- Network Access에서 `0.0.0.0/0` 허용 (Vercel IP가 유동적이므로)
- 배포 시 환경 변수 `MONGODB_URI`를 Vercel 프로젝트 설정에 추가


## 커밋 컨벤션

모든 커밋은 아래 형식을 따른다.

```
<type>: #<커밋-순번> <제목>

- 확인내용: <구현하면서 직접 확인한 내용, 추가 결정 사항>
- 이해 안 됐던 부분: <헷갈렸거나 새로 이해한 개념, 없으면 "없음">
```

번호는 타입(feat/chore/docs 등)과 무관하게 프로젝트 전체에서 단일 시퀀스로 증가한다.

### 타입

| 타입 | 용도 |
|---|---|
| `feat` | 새 기능 구현 |
| `fix` | 버그 수정 |
| `style` | 로직 변경 없는 스타일 수정 |
| `refactor` | 동작 변경 없는 코드 정리 |
| `chore` | 환경설정, 패키지 변경 |
| `docs` | 문서 수정 |

### 예시

```
feat: #6 PressWordmark 컴포넌트

- 확인내용: accentChar 인덱스 기반 문자 분리 로직 구현 확인, 한글 자간 적용 방식 검토
- 이해 안 됐던 부분: accentBg와 accentChar 조합 시 렌더링 우선순위 확인함
```

```
chore: #0 Vite + React TS + Tailwind v4 환경 설정

- 확인내용: @tailwindcss/vite 플러그인 연동, @theme 블록 토큰 등록 확인
- 이해 안 됐던 부분: 없음
```