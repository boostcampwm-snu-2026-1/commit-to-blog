# commit-to-blog — 주차별 개발 계획 및 상세 체크리스트

> GitHub 커밋 활동을 분석해 자동으로 개발 블로그 초안을 생성하는 웹 서비스

---

## 목차

1. [프로젝트 개요](#1-프로젝트-개요)
2. [기술 스택 선택 및 근거](#2-기술-스택-선택-및-근거)
3. [데이터 구조 정의](#3-데이터-구조-정의)
4. [컴포넌트 구조 정의](#4-컴포넌트-구조-정의)
5. [상태 흐름](#5-상태-흐름)
6. [API 연동 설계](#6-api-연동-설계)
7. [1주차 계획 — 기획 구체화 & 설계](#7-1주차-계획--기획-구체화--설계)
8. [2주차 계획 — 개발 & 검증](#8-2주차-계획--개발--검증)
9. [전체 체크리스트](#9-전체-체크리스트)

---

## 1. 프로젝트 개요

| 항목 | 내용 |
|------|------|
| 서비스명 | commit-to-blog |
| 목적 | GitHub 커밋 로그를 LLM으로 분석해 개발 블로그 초안 자동 생성 |
| 대상 사용자 | 블로그 글 작성에 시간이 부족한 개발자 |
| 핵심 가치 | 커밋 → 블로그까지 3번의 클릭 |

### 핵심 기능 범위 (MVP Scope)

- [ ] GitHub OAuth 또는 Personal Access Token으로 인증
- [ ] 내 Repository 목록 불러오기
- [ ] 브랜치 선택 → 커밋 목록 표시
- [ ] 커밋 선택 → AI 초안 생성
- [ ] 초안 편집기 (텍스트 수정)
- [ ] 초안 저장 (로컬 DB)
- [ ] 저장된 포스트 카드형 목록 조회
- [ ] 저장된 포스트 재편집 / 발행(게시) 상태 변경

---

## 2. 기술 스택 선택 및 근거

### Frontend

| 도구 | 선택 | 근거 |
|------|------|------|
| 번들러 | **Vite** | CRA 대비 빠른 HMR, 설정 간단 |
| UI 프레임워크 | **React 18** | 과제 요구사항 |
| 언어 | **TypeScript** | 타입 안정성, 데이터 구조 명확화 |
| 스타일 | **Tailwind CSS** | 유틸리티 클래스로 빠른 UI 구현 |
| 상태관리 | **Zustand** | Redux 대비 보일러플레이트 없음, Context보다 성능 우수 |
| 에디터 | **react-markdown + textarea** | 마크다운 미리보기, 의존성 최소화 |
| HTTP 클라이언트 | **axios** | 인터셉터로 토큰 주입 편리 |

### Backend

| 도구 | 선택 | 근거 |
|------|------|------|
| 런타임 | **Node.js 20** | 과제 요구사항 (Express) |
| 프레임워크 | **Express.js** | 과제 요구사항 |
| 언어 | **TypeScript** | 프론트와 타입 공유 가능 |
| DB | **SQLite (better-sqlite3)** | 파일 기반, 서버 설치 불필요, 충분한 규모 |
| ORM | **없음 (raw SQL)** | 단순한 스키마, 의존성 최소화 |
| 환경변수 | **dotenv** | `.env` 파일로 토큰 관리 |

### 외부 API

| API | 용도 |
|-----|------|
| GitHub REST API v3 | 레포 목록, 브랜치, 커밋, diff 조회 |
| OpenAI API (gpt-4o-mini) | 커밋 내용 → 블로그 초안 변환 |

---

## 3. 데이터 구조 정의

### 3-1. DB 스키마 (SQLite)

```sql
-- 저장된 블로그 포스트
CREATE TABLE posts (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  title       TEXT NOT NULL,
  content     TEXT NOT NULL,        -- AI가 생성한 마크다운 초안
  summary     TEXT,                 -- 미리보기용 짧은 요약 (150자)
  branch      TEXT,                 -- 원본 브랜치명
  commit_sha  TEXT,                 -- 원본 커밋 SHA
  repo_name   TEXT,                 -- 원본 레포명
  status      TEXT DEFAULT 'draft', -- 'draft' | 'published'
  created_at  TEXT DEFAULT (datetime('now')),
  updated_at  TEXT DEFAULT (datetime('now'))
);
```

### 3-2. API 응답 타입 (TypeScript 공용)

```typescript
// GitHub 관련
interface GithubRepo {
  id: number;
  name: string;
  full_name: string;
  private: boolean;
  default_branch: string;
}

interface GithubBranch {
  name: string;
  commit: { sha: string };
}

interface GithubCommit {
  sha: string;
  commit: {
    message: string;
    author: { name: string; date: string };
  };
}

// 내부 포스트
interface Post {
  id: number;
  title: string;
  content: string;
  summary: string;
  branch: string;
  commitSha: string;
  repoName: string;
  status: 'draft' | 'published';
  createdAt: string;
  updatedAt: string;
}

// AI 생성 요청/응답
interface GenerateRequest {
  repoFullName: string;
  commitSha: string;
  commitMessage: string;
  diff: string;        // git diff 내용 (truncated)
}

interface GenerateResponse {
  title: string;
  content: string;    // 마크다운
  summary: string;
}
```

---

## 4. 컴포넌트 구조 정의

### Frontend 디렉토리

```
client/
├── src/
│   ├── api/
│   │   ├── github.ts        # GitHub 관련 API 호출 함수
│   │   └── posts.ts         # 포스트 CRUD API 호출 함수
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx       # 상단 네비게이션 (My Blog / Saved Posts / Settings)
│   │   │   └── Layout.tsx       # 페이지 공통 레이아웃 래퍼
│   │   ├── post/
│   │   │   ├── PostCard.tsx     # 저장된 포스트 카드 (브랜치 태그, 요약, 날짜, 버튼)
│   │   │   ├── PostList.tsx     # 카드 그리드 + 빈 상태 표시
│   │   │   └── PostEditor.tsx   # 마크다운 에디터 + 미리보기
│   │   ├── blog/
│   │   │   ├── RepoSearch.tsx   # 저장소 검색 인풋
│   │   │   ├── BranchSelect.tsx # 브랜치 선택 드롭다운
│   │   │   ├── CommitList.tsx   # 커밋 목록 (선택 가능)
│   │   │   └── AiSummary.tsx    # AI 요약 결과 표시 박스
│   │   └── ui/
│   │       ├── Button.tsx
│   │       ├── Badge.tsx        # 브랜치 태그 배지
│   │       └── Spinner.tsx      # 로딩 인디케이터
│   ├── pages/
│   │   ├── SavedPostsPage.tsx   # /saved — 저장된 포스트 목록
│   │   ├── CreateBlogPage.tsx   # /create — 블로그 생성 (My Blog)
│   │   └── SettingsPage.tsx     # /settings — GitHub 토큰 설정
│   ├── store/
│   │   ├── postStore.ts         # Zustand: 포스트 목록 상태
│   │   └── blogCreateStore.ts   # Zustand: 블로그 생성 플로우 상태
│   ├── types/
│   │   └── index.ts             # 공용 TypeScript 타입
│   ├── App.tsx
│   └── main.tsx
├── index.html
├── vite.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

### Backend 디렉토리

```
server/
├── src/
│   ├── routes/
│   │   ├── github.ts    # GET /api/github/repos, /branches, /commits, /diff
│   │   ├── generate.ts  # POST /api/generate — LLM 호출
│   │   └── posts.ts     # GET/POST/PUT/DELETE /api/posts
│   ├── services/
│   │   ├── githubService.ts   # GitHub API 호출 로직
│   │   ├── llmService.ts      # OpenAI API 호출 + 프롬프트
│   │   └── postService.ts     # DB CRUD 로직
│   ├── db/
│   │   ├── index.ts           # DB 연결 초기화
│   │   └── migrations.ts      # 테이블 생성 SQL
│   ├── middleware/
│   │   └── errorHandler.ts    # 전역 에러 핸들러
│   ├── types/
│   │   └── index.ts           # 공용 타입 (client와 동일)
│   └── app.ts                 # Express 앱 설정
├── .env                       # GITHUB_TOKEN, OPENAI_API_KEY (gitignore)
├── .env.example               # 키 목록만 공개
├── package.json
└── tsconfig.json
```

---

## 5. 상태 흐름

### 블로그 생성 플로우

```
[SettingsPage] — GitHub Token 저장 (localStorage)
        ↓
[CreateBlogPage]
  [RepoSearch] → 입력 → GET /api/github/repos?q=검색어
        ↓ repoFullName 선택
  [BranchSelect] → GET /api/github/branches/:owner/:repo
        ↓ branch 선택
  [CommitList] → GET /api/github/commits/:owner/:repo?branch=
        ↓ commit 선택 (sha)
  [요약 생성 버튼] → POST /api/generate { repoFullName, commitSha, ... }
        ↓ AI 응답
  [AiSummary] — 초안 미리보기 (수정 가능 textarea)
        ↓ [블로그 포스트로 저장 및 게시] 클릭
  POST /api/posts → DB 저장 → SavedPostsPage로 이동
```

### Zustand 스토어

```typescript
// blogCreateStore.ts
interface BlogCreateState {
  selectedRepo: GithubRepo | null;
  selectedBranch: string;
  selectedCommit: GithubCommit | null;
  generatedPost: GenerateResponse | null;
  isGenerating: boolean;
  // actions
  setRepo, setBranch, setCommit, generate, reset
}

// postStore.ts
interface PostState {
  posts: Post[];
  isLoading: boolean;
  fetchPosts: () => Promise<void>;
  savePost: (data: Omit<Post, 'id'|'createdAt'|'updatedAt'>) => Promise<void>;
  updatePost: (id: number, data: Partial<Post>) => Promise<void>;
  deletePost: (id: number) => Promise<void>;
}
```

---

## 6. API 연동 설계

### GitHub API (서버에서만 호출)

| 엔드포인트 | 메서드 | 설명 |
|-----------|--------|------|
| `/api/github/repos` | GET | 사용자 레포 목록 (`?q=검색어`) |
| `/api/github/branches/:owner/:repo` | GET | 브랜치 목록 |
| `/api/github/commits/:owner/:repo` | GET | 커밋 목록 (`?branch=`) |
| `/api/github/diff/:owner/:repo/:sha` | GET | 특정 커밋 diff |

### LLM API (서버에서만 호출)

| 엔드포인트 | 메서드 | 설명 |
|-----------|--------|------|
| `/api/generate` | POST | 커밋 내용 → 블로그 초안 생성 |

**프롬프트 설계:**
```
[시스템] 당신은 개발 블로그 작성 전문가입니다. 주어진 커밋 정보를 바탕으로
         마크다운 형식의 개발 블로그 글을 작성하세요.
[사용자] 커밋 메시지: {message}
         변경 파일 diff:
         {diff (최대 3000 토큰으로 truncate)}
         
         다음 JSON으로 응답하세요:
         { "title": "...", "content": "...(마크다운)", "summary": "...(150자 이내)" }
```

### Posts REST API (서버 → DB)

| 엔드포인트 | 메서드 | 설명 |
|-----------|--------|------|
| `/api/posts` | GET | 전체 포스트 목록 |
| `/api/posts` | POST | 새 포스트 저장 |
| `/api/posts/:id` | PUT | 포스트 수정 |
| `/api/posts/:id` | DELETE | 포스트 삭제 |

---

## 7. 1주차 계획 — 기획 구체화 & 설계

> 목표: 코드 작성 없이 **설계를 완성**하고, 환경 세팅까지 완료

### 7-1. 기획 구체화 (Day 1~2)

- [ ] 서비스 사용 시나리오 2개 이상 작성 (Happy Path / Edge Case)
- [ ] 화면별 와이어프레임 스케치 (종이 또는 Figma)
  - [ ] Saved Posts 페이지
  - [ ] Create Blog 페이지 (My Blog)
  - [ ] Settings 페이지
- [ ] MVP 기능 범위 확정 및 Out-of-Scope 명시

### 7-2. 기술 스택 결정 (Day 2)

- [x] Frontend 스택 결정 (React + Vite + Tailwind + Zustand)
- [x] Backend 스택 결정 (Express + TypeScript + SQLite)
- [x] 각 선택의 근거 문서화 (이 파일 섹션 2)
- [ ] 팀 공유 및 검토

### 7-3. 데이터 구조 설계 (Day 2~3)

- [x] DB 스키마 설계 (posts 테이블)
- [x] TypeScript 공용 타입 정의
- [ ] API Request/Response 샘플 JSON 작성
- [ ] GitHub API 응답 구조 확인 (실제 curl 테스트)

### 7-4. 컴포넌트 & 디렉토리 구조 설계 (Day 3~4)

- [x] Frontend 디렉토리 구조 확정
- [x] Backend 디렉토리 구조 확정
- [ ] 각 컴포넌트 Props 인터페이스 정의
- [ ] 페이지별 라우팅 설계 (`react-router-dom`)

### 7-5. 상태 흐름 설계 (Day 4)

- [x] 블로그 생성 플로우 다이어그램 작성
- [x] Zustand 스토어 인터페이스 정의
- [ ] 에러 상태 플로우 정의 (API 실패, 빈 결과 등)

### 7-6. 환경 세팅 (Day 4~5)

- [ ] 모노레포 구조 확정 (`/client`, `/server`)
- [ ] `client/` — Vite + React + TypeScript 프로젝트 초기화
  - [ ] `npm create vite@latest client -- --template react-ts`
  - [ ] Tailwind CSS 설치 및 설정
  - [ ] `react-router-dom`, `zustand`, `axios` 설치
- [ ] `server/` — Express + TypeScript 프로젝트 초기화
  - [ ] `npm init` + `express`, `typescript`, `ts-node`, `nodemon` 설치
  - [ ] `better-sqlite3`, `dotenv`, `cors` 설치
  - [ ] `tsconfig.json` 설정
- [ ] `.env.example` 파일 작성
- [ ] `.gitignore`에 `.env`, `*.db`, `node_modules` 추가
- [ ] `package.json` root scripts 설정 (`dev`, `build`)

### 7-7. 설계 검증 (Day 5)

- [ ] PLAN.md 리뷰: 구현 불가 항목 없는지 확인
- [ ] GitHub API rate limit 확인 (인증 시 5000 req/hr)
- [ ] OpenAI 비용 추정 (gpt-4o-mini 기준, diff 1회 ≈ $0.001)
- [ ] 1주차 설계 내용 commit & push

---

## 8. 2주차 계획 — 개발 & 검증

> 목표: MVP 기능 전체 구현 + 수동 테스트 완료

### 8-1. Backend 기반 구현 (Day 1~2)

- [ ] Express 앱 기본 설정 (`app.ts`, CORS, JSON 파싱)
- [ ] SQLite DB 초기화 및 마이그레이션 (`db/index.ts`)
- [ ] 전역 에러 핸들러 미들웨어

**GitHub API 라우트 (`/api/github`)**
- [ ] `GET /repos` — GitHub 레포 목록 (토큰은 요청 헤더에서 전달)
- [ ] `GET /branches/:owner/:repo` — 브랜치 목록
- [ ] `GET /commits/:owner/:repo?branch=` — 커밋 목록
- [ ] `GET /diff/:owner/:repo/:sha` — 커밋 diff 조회

**LLM 라우트 (`/api/generate`)**
- [ ] `POST /generate` — OpenAI API 호출, 블로그 초안 반환
- [ ] 프롬프트 작성 및 JSON 파싱 처리
- [ ] diff 토큰 초과 방지 truncate 로직

**Posts 라우트 (`/api/posts`)**
- [ ] `GET /posts` — 전체 포스트 조회 (최신순)
- [ ] `POST /posts` — 포스트 저장
- [ ] `PUT /posts/:id` — 포스트 수정
- [ ] `DELETE /posts/:id` — 포스트 삭제

### 8-2. Frontend 기반 구현 (Day 2~3)

**공통**
- [ ] axios 인스턴스 생성 (baseURL 설정)
- [ ] GitHub Token localStorage 저장/읽기 유틸

**Settings 페이지**
- [ ] GitHub Personal Access Token 입력 폼
- [ ] 토큰 저장 (localStorage) 및 유효성 확인 버튼

**Saved Posts 페이지**
- [ ] `PostList` — 포스트 카드 그리드 (빈 상태 UI 포함)
- [ ] `PostCard` — 브랜치 배지, 커버 이미지 영역, 요약, 날짜, 수정/발행 버튼
- [ ] `GET /api/posts` 연동
- [ ] 발행 버튼 → status `published`로 PUT 요청

**Create Blog 페이지**
- [ ] `RepoSearch` — debounce 검색 인풋 (500ms)
- [ ] `BranchSelect` — 드롭다운 (레포 선택 후 활성화)
- [ ] `CommitList` — 커밋 목록 (SHA 뱃지, 메시지, 작성자, 날짜)
- [ ] 커밋 선택 → 우측 패널에 커밋 정보 표시
- [ ] "요약 생성" 버튼 → `POST /api/generate` → 로딩 스피너
- [ ] `AiSummary` — AI 초안 textarea (수정 가능, 글자 수 표시)
- [ ] "블로그 포스트로 저장 및 게시" → `POST /api/posts` → Saved Posts로 이동

**라우팅**
- [ ] `react-router-dom` 설정
- [ ] Header 네비게이션 링크 연결

### 8-3. UI 완성도 (Day 3~4)

- [ ] 반응형 레이아웃 (모바일 대응은 제외, 1280px 이상 기준)
- [ ] 로딩 상태 UI (Spinner 컴포넌트)
- [ ] 에러 상태 UI (토큰 없음, API 실패, 결과 없음)
- [ ] 빈 상태 UI ("새 초안 작성" 카드 — 점선 테두리)
- [ ] 예시 화면과 색상/레이아웃 유사도 확인

### 8-4. 테스트 & 검증 (Day 4~5)

**수동 테스트 시나리오**

- [ ] **Happy Path**: 토큰 설정 → 레포 검색 → 브랜치 선택 → 커밋 선택 → AI 생성 → 저장 → Saved Posts 확인
- [ ] **Edge Case 1**: 토큰 없이 API 요청 → 에러 메시지 표시
- [ ] **Edge Case 2**: 빈 레포 (커밋 없음) → 빈 목록 표시
- [ ] **Edge Case 3**: diff가 매우 큰 커밋 → truncate 후 생성 성공
- [ ] **Edge Case 4**: OpenAI API 키 없음 → 에러 메시지 표시
- [ ] **Edge Case 5**: 저장된 포스트 수정 후 재저장
- [ ] **Edge Case 6**: 저장된 포스트 발행 → status 변경 확인

**API 검증**
- [ ] 모든 API 엔드포인트 curl/Postman으로 개별 테스트
- [ ] DB 파일에 데이터 정상 저장 확인

### 8-5. 마무리 (Day 5)

- [ ] `.env.example` 최신화
- [ ] README.md 업데이트 (실행 방법, 환경변수 설명)
- [ ] 불필요한 console.log 제거
- [ ] 최종 동작 확인 후 commit & push

---

## 9. 전체 체크리스트

### 설계 완료 조건

- [ ] 모든 화면의 컴포넌트 구조가 파일 단위로 정의됨
- [ ] 모든 API 엔드포인트의 Request/Response 타입이 정의됨
- [ ] DB 스키마가 확정됨
- [ ] 상태 흐름 다이어그램이 완성됨
- [ ] 기술 스택 선택 이유가 문서화됨

### 구현 완료 조건

- [ ] 로컬에서 `npm run dev` 한 번으로 client + server 동시 실행
- [ ] GitHub 토큰 입력 후 내 레포 목록이 보임
- [ ] 커밋 선택 후 AI 초안이 10초 이내에 생성됨
- [ ] 생성된 초안을 편집하고 저장할 수 있음
- [ ] 저장된 포스트가 카드 목록에 표시됨
- [ ] 포스트의 수정/발행 버튼이 동작함

### 코드 품질 조건

- [ ] TypeScript 타입 에러 0개 (`tsc --noEmit` 통과)
- [ ] `.env` 파일이 git에 포함되지 않음
- [ ] API 키가 클라이언트 코드에 노출되지 않음
- [ ] 각 컴포넌트가 단일 책임을 가짐

---

## 변경 이력

| 날짜 | 내용 |
|------|------|
| 2026-05-17 | 최초 작성 (1주차 설계 단계) |
