# 개발 체크리스트

## 1주차 — 설계 및 환경 준비

- [x] /code 스킬 제작
- [x] /workflow 스킬 제작
- [x] 사용자 흐름 파악 (전체 페이지 UI/UX 설계)
- [x] 외부 API 연동 방식 정의 (GitHub API, OpenAI API)
- [x] 데이터 구조 정의 (저장소/브랜치/커밋/포스트/유저)
- [x] 저장 방식 결정 (MongoDB, Post 스키마)
- [x] API 설계 (엔드포인트 목록)
- [x] 컴포넌트 구조 설계
- [x] 상태 흐름 정리
- [x] 예외/에러 처리 방식 정의
- [x] CLAUDE.md 작성

## 2주차 — 구현

### 프로젝트 세팅
- [ ] frontend / backend 폴더 구조 및 package.json 초기 세팅
- [ ] .env 파일 설정 (GITHUB_TOKEN, OPENAI_API_KEY)
- [ ] MongoDB 연결 설정
- [ ] Express 서버 기본 세팅 (라우터 구조, CORS, 환경변수 로드)

### 백엔드 — GitHub API 연동
- [ ] 저장소 검색 API (`GET /api/github/repos?q=`)
- [ ] 브랜치 목록 API (`GET /api/github/repos/:owner/:repo/branches`)
- [ ] 커밋 목록 API (`GET /api/github/repos/:owner/:repo/commits?sha=`)
- [ ] AI 요약 생성 API (`POST /api/github/.../commits/:sha/summary`) — 커밋 상세(patch) 조회 후 OpenAI 호출
- [ ] 유저 프로필 API (`GET /api/user`)

### 백엔드 — 포스트 API
- [ ] 포스트 저장 (`POST /api/posts`)
- [ ] 포스트 목록 조회 (`GET /api/posts`)
- [ ] 포스트 상세 조회 (`GET /api/posts/:id`)
- [ ] 포스트 수정 (`PATCH /api/posts/:id`)

### 프론트엔드 — 공통
- [ ] React Router 설정 및 Layout 컴포넌트
- [ ] Header 컴포넌트 (Logo, Nav, UserAvatar)

### 프론트엔드 — 글쓰기 페이지
- [ ] RepoSearch 컴포넌트 (입력, 자동완성 드롭다운, 검색)
- [ ] BranchSelect 컴포넌트 (드롭다운)
- [ ] CommitList / CommitItem 컴포넌트
- [ ] CommitDetail 컴포넌트 (커밋 정보, AI 요약, 저장 버튼)
- [ ] 글쓰기 페이지 상태 연결 (selectedRepo → selectedBranch → commits → selectedCommit → summary)

### 프론트엔드 — 내 블로그 페이지
- [ ] PostCard 컴포넌트 (브랜치, 일시, 제목, 요약, 수정/발행 버튼)
- [ ] NewPostCard 컴포넌트
- [ ] 내 블로그 페이지 레이아웃 및 API 연결

### 프론트엔드 — 포스트 페이지
- [ ] 포스트 페이지 (제목, 메타, 본문, 뒤로가기)
