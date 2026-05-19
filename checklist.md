# commit-to-blog 개발 체크리스트

> 테마: Gruvbox 다크 | 폰트: 세리프 (Georgia / Noto Serif KR)  
> 브랜치: `snkii` | 체크리스트 단위로 커밋

---

## Phase 0. 프로젝트 셋업

- [x] `client/` — Vite + React 프로젝트 초기화
- [x] `server/` — Express 프로젝트 초기화 (`npm init`, 의존성 설치)
- [x] `.env.example` 파일 생성 (GITHUB_TOKEN, OPENAI_API_KEY, PORT)
- [x] `.gitignore` 에 `.env`, `node_modules`, `server/data/posts.json` 추가
- [x] `package.json` (루트) — `dev` 스크립트로 client/server 동시 실행 설정

---

## Phase 1. Gruvbox 테마 & 기본 레이아웃

- [ ] `client/src/styles/gruvbox.css` — CSS 변수 정의 (배경, 전경, 강조색)
- [ ] 전역 스타일 — 세리프 폰트 적용 (Google Fonts Noto Serif KR import)
- [ ] `App.jsx` — 기본 라우팅 구조 (`/` 목록, `/editor` 작성/편집)
- [ ] `common/Button` 컴포넌트 — Gruvbox 스타일
- [ ] `common/Card` 컴포넌트 — 포스트 카드 껍데기

---

## Phase 2. GitHub 저장소 연동 (서버)

- [ ] `server/routes/github.js` — GitHub API 프록시 라우터 생성
- [ ] `GET /api/github/repos` — 인증된 사용자의 저장소 목록 반환
- [ ] `GET /api/github/repos/:owner/:repo/branches` — 브랜치 목록 반환
- [ ] `GET /api/github/repos/:owner/:repo/commits?branch=` — 커밋 목록 반환
- [ ] `GET /api/github/repos/:owner/:repo/commits/:sha` — 커밋 상세 (diff 포함)
- [ ] GitHub Token 환경변수로 관리, 서버에서만 사용 확인

---

## Phase 3. GitHub 저장소 연동 (클라이언트)

- [ ] `client/src/api/github.js` — fetch 래퍼 함수 모음
- [ ] `RepoSelector/RepoSelector.jsx` — 저장소 드롭다운
- [ ] `RepoSelector/BranchSelector.jsx` — 브랜치 드롭다운
- [ ] `RepoSelector/CommitList.jsx` — 커밋 목록 + 다중 선택 체크박스
- [ ] 선택된 커밋의 diff 데이터를 상태로 보관

---

## Phase 4. LLM 블로그 초안 생성

- [ ] `server/routes/llm.js` — LLM 요청 라우터
- [ ] `POST /api/llm/generate` — 커밋 diff + 메시지 받아서 블로그 초안 반환
- [ ] 프롬프트 설계: 커밋 목록 → 개발 블로그 포스트 (제목 + 본문 마크다운)
- [ ] OpenAI API Key 서버에서만 사용 확인
- [ ] 클라이언트 `api/llm.js` — generate 호출 함수

---

## Phase 5. 포스트 편집기

- [ ] `PostEditor/PostEditor.jsx` — AI 초안을 표시하고 수정할 수 있는 textarea
- [ ] 제목 편집 입력창
- [ ] 마크다운 미리보기 토글 (선택: 라이브러리 없이 `<pre>` 로 시작)
- [ ] "저장" 버튼 → `POST /api/posts` 호출
- [ ] "발행" / "임시저장" 상태 토글

---

## Phase 6. 포스트 저장 & 목록 (서버)

- [ ] `server/data/posts.json` 초기 파일 생성 (`[]`)
- [ ] `server/routes/posts.js` — 포스트 CRUD 라우터
- [ ] `GET /api/posts` — 전체 포스트 목록
- [ ] `GET /api/posts/:id` — 포스트 상세
- [ ] `POST /api/posts` — 포스트 생성
- [ ] `PUT /api/posts/:id` — 포스트 수정
- [ ] `DELETE /api/posts/:id` — 포스트 삭제

---

## Phase 7. 포스트 목록 UI

- [ ] `PostList/PostList.jsx` — 카드 그리드 레이아웃
- [ ] `PostList/PostCard.jsx` — 브랜치 태그, 요약, 날짜 표시
- [ ] `pages/HomePage.jsx` — 포스트 목록 + "새 포스트 작성" 버튼
- [ ] `pages/EditorPage.jsx` — RepoSelector → LLM 생성 → PostEditor 흐름 연결
- [ ] 포스트 카드 클릭 → 편집 페이지로 이동

---

## Phase 8. 마무리 & 검증

- [ ] 전체 흐름 E2E 테스트: 저장소 선택 → 커밋 선택 → AI 생성 → 저장 → 목록 확인
- [ ] `.env.example` 최신화
- [ ] README.md 업데이트 (실행 방법, 환경변수 설명)
- [ ] Gruvbox 테마 + 세리프 폰트 시각적 검수
- [ ] 민감정보 커밋 여부 최종 확인 (`git log --all -- .env`)

---

## 진행 현황

| Phase | 상태 | 완료일 |
|-------|------|--------|
| 0. 셋업 | ✅ 완료 | 2026-05-19 |
| 1. 테마/레이아웃 | 🔲 대기 | - |
| 2. GitHub 서버 | 🔲 대기 | - |
| 3. GitHub 클라이언트 | 🔲 대기 | - |
| 4. LLM 생성 | 🔲 대기 | - |
| 5. 편집기 | 🔲 대기 | - |
| 6. 포스트 저장 서버 | 🔲 대기 | - |
| 7. 포스트 목록 UI | 🔲 대기 | - |
| 8. 마무리 | 🔲 대기 | - |
