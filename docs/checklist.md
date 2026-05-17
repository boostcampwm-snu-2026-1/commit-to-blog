# 구현 체크리스트 (docs/checklist.md)

이 문서는 프론트엔드와 백엔드의 병렬 개발 흐름을 관리하기 위한 테이블 형식의 체크리스트입니다.

| 단계 (Step) | 프론트엔드 트랙 (Frontend Track) | 백엔드 트랙 (Backend Track) |
| :--- | :--- | :--- |
| **Step 1: Setup** | **F1: Frontend Setup**<br>- 1. [x] **프로젝트 초기화**: Vite+React 구축<br>- 2. [ ] **라이브러리 설치**: axios, router 등<br>- 3. [x] **폴더 생성**: api, component, page 등<br>- 4. [ ] **상태 생성**: Context API 틀 구성<br>- 5. [ ] **라우터 생성**: BrowserRouter 설정 | **B1: Backend Setup**<br>- 1. [ ] **프로젝트 초기화**: npm init -y<br>- 2. [ ] **라이브러리 설치**: express, mongoose 등<br>- 3. [ ] **폴더 생성**: routes, controller, services 등<br>- 4. [ ] **환경 설정**: .env 및 DB 연결 설정<br>- 5. [ ] **서버 초기화**: Express 서버 객체 설정 |
| **Step 2: Core** | **F2: Frontend Layout**<br>- 1. [ ] **베이스 레이아웃**: 상단 탭/메인 영역<br>- 2. [ ] **보기(VIEW) 탭**: 필터, 카드, 리스트<br>- 3. [ ] **작성(WRITE) 탭**: 커밋 선택기, 에디터 | **B2-1: Backend Logic**<br>- 1. [ ] **데이터 모델 정의**: Post, Cache 스키마<br>- 2. [ ] **GitHub 연동 서비스**: API 호출/캐싱<br>- 3. [ ] **AI 요약 서비스**: Diff 추출/Gemini 연동 |
| **Step 3: Integration** | **F3: Frontend Features**<br>- 1. [ ] **저장 기능**: DB 저장/생성 연동<br>- 2. [ ] **토글/화면 제어**: 탭 전환/수정 모드<br>- 3. [ ] **데이터 필터링**: 태그 및 리포 필터링<br>- 4. [ ] **GitHub 동기화**: 동기화 요청 로직<br>- 5. [ ] **AI 요약**: 요약 요청 로직 | **B2-2: Backend API**<br>- 1. [ ] **API 엔드포인트**: 포스트 CRUD 완성<br>- 2. [ ] **API 엔드포인트**: 동기화/요약 엔드포인트 |

// --- [체크리스트 테이블 전면 수정] 구현 종료 ---
