# 구현 체크리스트

---

## 1주차 — 기반 세팅 & 프론트엔드 UI

### Phase 1 — 프로젝트 기반 세팅

#### 프로젝트 초기화
- [ ] 루트 폴더 구조 생성 (`/client`, `/server`)
- [ ] `server/` — Express + TypeScript 초기화 (`npm init`, `tsconfig.json`)
- [ ] `client/` — React + TypeScript 초기화 (`create vite@latest`)
- [ ] `.gitignore` 작성 (`.env`, `node_modules/` 포함)
- [ ] `.env` 파일 생성 및 변수 목록 정의 (실제 값은 추후 입력)

#### 환경변수 목록 확보
- [ ] `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET` 자리 잡기
- [ ] `OPENAI_API_KEY` 자리 잡기
- [ ] `SESSION_SECRET`, `DATABASE_URL` 자리 잡기

#### 공통 설정
- [ ] ESLint + Prettier 설정
- [ ] 클라이언트 ↔ 서버 프록시 설정 (Vite `proxy` 옵션)
- [ ] React Router 설치 및 기본 라우트 구성

---

### Phase 2 — 프론트엔드 페이지 & 컴포넌트 (목업 데이터 기반)

#### 페이지 레이아웃
- [ ] 공통 레이아웃 / 네비게이션 바 구현
- [ ] 로그인 페이지 UI (GitHub 로그인 버튼, 실제 연동은 2주차)

#### 블로그 생성 페이지 (`/create`)
- [ ] `RepoSelector` 컴포넌트 — 저장소 목록 드롭다운 (목업 데이터)
- [ ] 브랜치 선택 드롭다운 (목업 데이터)
- [ ] `CommitList` 컴포넌트 — 커밋 목록 + 다중 선택 체크박스 (목업 데이터)
- [ ] "초안 생성" 버튼 및 로딩 상태 UI

#### 에디터 페이지 (`/editor`)
- [ ] TipTap 설치 및 기본 에디터 구성
- [ ] 마크다운 입력 → 리치 텍스트 렌더링
- [ ] 툴바 구성 (Bold, Italic, Heading, Code Block, Link)
- [ ] 제목 입력 필드
- [ ] "임시저장" / "발행" 버튼 UI

#### 포스트 목록 페이지 (`/posts`)
- [ ] `PostCard` 컴포넌트 — 제목, 브랜치 태그, 날짜, 미리보기 (목업 데이터)
- [ ] 카드 그리드 레이아웃
- [ ] `draft` / `published` 배지 표시
- [ ] 카드 클릭 → 에디터 진입 플로우

---

## 2주차 — 백엔드 연동 & 기능 완성

### Phase 3 — GitHub OAuth 인증

- [ ] GitHub OAuth App 생성 (github.com → Settings → Developer settings)
- [ ] `express-session` 미들웨어 설정
- [ ] `GET /auth/github` 라우터 — GitHub 로그인 리다이렉트
- [ ] `GET /auth/github/callback` 라우터 — 토큰 수령 및 세션 저장
- [ ] `POST /auth/logout` 라우터
- [ ] 클라이언트 로그인 버튼 → 실제 OAuth 플로우 연결
- [ ] 인증 상태에 따른 라우트 보호 미들웨어

---

### Phase 4 — GitHub API 연동 (서버 프록시)

- [ ] `GET /api/repos` — 유저 저장소 목록 조회
- [ ] `GET /api/repos/:owner/:repo/branches` — 브랜치 목록 조회
- [ ] `GET /api/repos/:owner/:repo/commits` — 커밋 로그 조회 (`?sha=브랜치명`)
- [ ] `GET /api/repos/:owner/:repo/commits/:sha` — 커밋 diff 상세 조회
- [ ] GitHub API 에러 핸들링 (rate limit, 401, 404)
- [ ] 클라이언트 `RepoSelector`, `CommitList` — 목업 데이터 → 실제 API 교체

---

### Phase 5 — AI 초안 생성

- [ ] OpenAI SDK 설치 및 클라이언트 초기화
- [ ] `POST /api/generate` 라우터 구현
  - [ ] 선택된 커밋 sha 목록 수신
  - [ ] 각 커밋의 diff 수집 (GitHub API)
  - [ ] 프롬프트 구성 (diff + 커밋 메시지 → 블로그 초안 요청)
  - [ ] OpenAI API 호출 및 마크다운 응답 반환
- [ ] 프롬프트 설계 및 튜닝
- [ ] 스트리밍 응답 처리 (선택, UX 향상용)
- [ ] 클라이언트 "초안 생성" 버튼 → 실제 API 연결, 에디터에 자동 로드

---

### Phase 6 — DB & 포스트 CRUD

- [ ] Prisma 설치 및 `schema.prisma` 작성
  - [ ] `Post` 모델 (id, title, content, status, repoName, branchName, createdAt, updatedAt)
- [ ] `prisma migrate dev` 실행
- [ ] `POST /api/posts` — 포스트 저장
- [ ] `GET /api/posts` — 포스트 목록 조회
- [ ] `GET /api/posts/:id` — 포스트 상세 조회
- [ ] `PUT /api/posts/:id` — 포스트 수정
- [ ] `DELETE /api/posts/:id` — 포스트 삭제
- [ ] 클라이언트 저장/수정/삭제 → 실제 API 연결
- [ ] `draft` / `published` 상태 토글 기능 완성

---

## 보안 점검 (2주차 완료 후)

- [ ] `.env`가 `.gitignore`에 포함되어 있는지 확인
- [ ] GitHub token이 클라이언트 응답에 절대 포함되지 않는지 확인
- [ ] OpenAI API 키가 서버에서만 사용되는지 확인
- [ ] 세션 쿠키 `httpOnly: true`, `secure: true` 설정 확인
- [ ] 인증되지 않은 요청에 대한 API 보호 확인
