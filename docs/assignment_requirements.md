# [cite_start]📋 과제 요구사항 명세서: 스마트블로그 서비스 (GitHub 연동) [cite: 2]

## 1. 학습 목표
* [cite_start]스스로 기획과 요구사항을 분석해서 개발할 수 있다. [cite: 11]
* [cite_start]LLM을 연동한 서비스를 만들 수 있다. [cite: 14]

## 2. 핵심 기능 요구사항
[cite_start]GitHub 활동 데이터를 분석해 자동으로 블로그 글을 생성하는 서비스 구축. [cite: 16]

### [cite_start]2.1 블로그 생성 (Create Blog) 기능 [cite: 34]
* [cite_start]**저장소 연동:** 사용자의 GitHub Repository 리스트를 불러오고 특정 저장소를 선택할 수 있어야 함. [cite: 35]
* [cite_start]**AI 초안 작성:** OpenAI LLM (또는 기타 LLM API)이 선택된 커밋 코드 사항을 분석하여 블로그 형태의 초안을 작성함. [cite: 36]
* [cite_start]**수정 인터페이스:** 생성한 글을 사용자가 직접 수정 및 보완할 수 있는 인터페이스를 제공해야 함. [cite: 38]

### [cite_start]2.2 저장된 포스트 보기 기능 [cite: 39]
* [cite_start]**포스트 목록 보기:** 저장된 포스트들을 카드 형태로 (제목, 날짜 포함) 미리 볼 수 있어야 함. [cite: 40]
* [cite_start]**수정 및 발행:** 저장한 글을 다시 편집하거나, 최종 검토 후 블로그에 게시할 수 있어야 함. [cite: 41]

## 3. 프로그래밍 및 아키텍처 요구사항

### [cite_start]3.1 AI 활용 및 구현 [cite: 51]
* [cite_start]**AI Workflow 개선:** 초안 생성 프롬프트 및 워크플로우를 꾸준히 보완하며 개선해야 함. [cite: 53, 54]
* **나만의 Skill 만들기:** Agent 개발에서 필요한 나만의 Skill을 하나 만들어서 사용해야 함. (개발 중 발견된 좋은 프로세스나 방식을 패턴화) [cite_start][cite: 55, 56]

### [cite_start]3.2 개발 계획 및 설계 [cite: 57]
* [cite_start]**도구 선택:** 프레임워크, 라이브러리 등을 선택한 명확한 이유를 설명할 수 있어야 함. [cite: 58, 59, 61]
* [cite_start]**구현 범위 관리:** To-do 리스트로 나열하여 관리. [cite: 63, 64]
* [cite_start]**데이터 및 구조 정의:** * 화면별로 필요한 데이터를 도출. [cite: 66, 67]
  * [cite_start]React 기반(Client) 및 Express 기반(Server) 디렉토리/컴포넌트 구조 정의. [cite: 68, 69, 70]
  * [cite_start]어떤 상태(State)가 어떤 구조를 타고 이동하는지 흐름 정의. [cite: 74]
  * [cite_start]데이터를 어디에(예: Memory) 어떻게 보관할 것인지 결정. [cite: 75, 76, 77]
* [cite_start]**인터랙션 및 검증:** 사용자 관점의 인터랙션 정의 및 기능 구현 완료에 대한 테스트/검증 기준 마련. [cite: 78, 79, 81, 82, 83]

### [cite_start]3.3 API 연동 아키텍처 (보안 필수) [cite: 84]
* [cite_start]**시스템 흐름:** `Browser(UI)` ➡️ `React Client` ➡️ `Express Server` ➡️ `GitHub API` & `LLM API` [cite: 89, 90, 91, 92, 93, 94, 95, 96, 97]
* [cite_start]**서버 경유 요청:** GitHub API 및 LLM API 요청은 반드시 Express 기반의 서버에서 수행해야 함. [cite: 87]
* [cite_start]**보안:** 연동에 필요한 Token 등의 민감 정보는 외부에 노출되지 않도록 서버 단에서 안전하게 관리해야 함. [cite: 88]

## [cite_start]4. 진행 방식 (2주 프로젝트) [cite: 43]
* [cite_start]**1주차:** 기획, 요구사항 분석, 아키텍처 설계 위주로 진행. [cite: 47]
* [cite_start]**2주차:** 본격적인 설계 내용 반영 및 코드 개발 위주로 진행. [cite: 48]