# 개발 체크리스트

> 2주 개발 일정 기준. 완료된 항목은 ✅, 진행 중은 🔄, 미착수는 ⬜

---

## 1주차 — 설계 & 환경 세팅

### 설계
- ✅ 기술 스택 선택 및 근거 문서화 (PLAN.md)
- ✅ DB 스키마 설계 (posts 테이블)
- ✅ TypeScript 공용 타입 정의
- ✅ API 엔드포인트 목록 확정
- ✅ 컴포넌트 디렉토리 구조 확정
- ✅ 상태 흐름 다이어그램 작성

### 환경 세팅 (feat #1)
- ✅ client — Vite + React + TypeScript 초기화
- ✅ Tailwind CSS 설치 및 설정
- ✅ react-router-dom, zustand, axios 설치
- ✅ server — Express + TypeScript 초기화
- ✅ better-sqlite3, dotenv, cors 설치
- ✅ `.env.example` 작성
- ✅ `.gitignore` 설정 (.env, *.db, node_modules)
- ✅ 루트 package.json — 통합 dev 스크립트

---

## 2주차 — 기능 개발

### Backend

#### feat #2 — Settings / 인증
- ✅ `GET /api/github/me` — 토큰 유효성 확인

#### feat #3 — GitHub API
- ✅ `GET /api/github/repos` — 레포 목록 (검색 포함)
- ✅ `GET /api/github/branches/:owner/:repo` — 브랜치 목록
- ✅ `GET /api/github/commits/:owner/:repo` — 커밋 목록
- ✅ `GET /api/github/diff/:owner/:repo/:sha` — diff (6000자 truncate)

#### feat #4 — Posts API
- ✅ SQLite DB 초기화 (WAL 모드)
- ✅ `GET /api/posts` — 전체 목록 (최신순)
- ✅ `POST /api/posts` — 포스트 저장
- ✅ `PUT /api/posts/:id` — 포스트 수정 (partial update)
- ✅ `DELETE /api/posts/:id` — 포스트 삭제

#### feat #5 — LLM API
- ✅ `POST /api/generate` — OpenAI gpt-4o-mini 호출
- ✅ 시스템 프롬프트 작성 (블로그 구조 지정)
- ✅ JSON 응답 강제 (response_format: json_object)
- ✅ summary 150자 truncate

### Frontend

#### feat #2 — 라우팅 & 공통 레이아웃
- ✅ react-router-dom 라우팅 설정
- ✅ Header 컴포넌트 (NavLink 활성화 표시)
- ✅ Layout 컴포넌트
- ✅ axios 인스턴스 (토큰 자동 헤더 주입)

#### feat #2 — Settings 페이지
- ✅ GitHub Token 입력/저장 (localStorage)
- ✅ 토큰 확인 버튼 (`/api/github/me` 연동)
- ✅ 성공/실패 메시지 표시

#### feat #6 — Create Blog 페이지
- ⬜ RepoSearch — debounce 검색 인풋
- ⬜ BranchSelect — 드롭다운
- ⬜ CommitList — 커밋 목록 (선택 가능)
- ⬜ AiSummary — AI 초안 textarea (수정 가능)
- ⬜ "블로그 포스트로 저장" → POST /api/posts 연동

#### feat #7 — Saved Posts 페이지
- ⬜ PostCard — 브랜치 배지, 요약, 날짜, 버튼
- ⬜ PostList — 카드 그리드 + 빈 상태 UI
- ⬜ 수정 버튼 → 에디터로 이동
- ⬜ 발행 버튼 → status published로 PUT 연동

---

## 검증 체크리스트

### 구현 완료 기준
- ⬜ 로컬에서 `npm run dev`로 client + server 동시 실행
- ⬜ GitHub 토큰 입력 후 내 레포 목록이 보임
- ⬜ 커밋 선택 후 AI 초안이 10초 이내 생성
- ⬜ 생성된 초안을 편집하고 저장 가능
- ⬜ 저장된 포스트가 카드 목록에 표시
- ⬜ 수정/발행 버튼 동작

### 코드 품질
- ✅ TypeScript 에러 0개 (client, server 모두)
- ✅ `.env` 파일 git 미포함
- ✅ API 키가 클라이언트 코드에 미노출
