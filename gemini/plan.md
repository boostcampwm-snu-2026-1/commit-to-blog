# GitHub Activity Analysis Blog - 기획안

## 1. 프로젝트 개요
GitHub 커밋 기록을 바탕으로 Gemini AI를 활용해 개발 블로그 포스트를 반자동으로 생성하고, 이를 체계적으로 분류하여 관리할 수 있는 **1인용(Personal)** 웹 애플리케이션입니다.

## 2. 기술 스택
* **Frontend**: React (JavaScript)
* **Backend**: Node.js (Express.js)
* **Database**: MongoDB
* **AI API**: Gemini API
* **Auth**: 백엔드 환경변수(`.env`)를 통한 단일 계정(Personal Access Token) 연동

## 3. 기능 요약

### A. 등록 기능 (Post Generation)
* **대상 선택**: 사용자의 GitHub 계정과 연동되어 리포지토리, 브랜치, 커밋 로그를 차례대로 선택 가능.
* **AI 요약 기능**: 선택한 커밋의 변경 사항(Diff) 데이터를 Gemini API로 전송하여 포스트 초안(제목, 본문) 자동 생성.
* **자동 태깅 기능**: AI가 커밋 내용을 분석하여 적절한 작업 유형(Feat, Fix 등)과 기술 스택 태그 자동 추출.
* **편집기 기능 (Editor)**: AI가 생성한 초안을 사용자가 직접 검수하고 수정할 수 있는 마크다운 기반 에디터 제공.

### B. 보기 기능 (Post Viewing & Management)
* **목록 표시**: DB에 저장된 블로그 포스트들을 최신순 등으로 리스팅.
* **필터 기능**: 리포지토리, 작업 유형, 기술 스택 태그 등을 기준으로 한 필터링 검색.
* **수정 기능**: 등록된 블로그 포스트의 내용이나 태그 재수정 가능.

## 4. 구체적 구현 방안

### 4.1. 데이터 연동 및 환경 설정
* **GitHub 연동**: GitHub Personal Access Token을 `.env`에 저장하고, Node.js에서 GitHub REST API를 호출하여 데이터 확보.
* 동기화 버튼을 통해 DB에 레포지토리, 브랜치, 커밋 로그를 저장, 필요할 때마다 동기화하여 DB 업데이트.
* **Gemini 연동**: `@google/genai` 등을 활용해 커밋 Diff 데이터와 프롬프트를 전송하고 JSON 형태로 응답 수신.

### 4.2. 프론트엔드 (React)
* **단계별 UI**: 리포지토리 -> 브랜치 -> 커밋으로 이어지는 선택 단계를 명확한 흐름으로 구현.
* **에디터**: `react-markdown` 등을 활용해 마크다운 미리보기 및 편집 UI 구축.
* **필터링**: 상단 필터바를 통해 선택된 조건에 맞는 데이터만 표시되도록 상태 관리.

### 4.3. 백엔드 및 DB (Node.js + MongoDB)
* **REST API**: GitHub API 프록시, AI 요약 처리, MongoDB CRUD를 수행하는 엔드포인트 구성.
* **Mongoose Schema**: `title`, `content`, `githubUrl`, `repository`, `commitSha`, `type`, `tags`, `createdAt` 필드 정의.

## 5. UI 레이아웃
*(상세 레이아웃은 함께 생성된 `plan.pdf` 파일을 참고하세요)*
