# GEMINI.md

## 1. 프로젝트 개요
- **프로젝트 명**: commit-to-blog
- **설명**: 사용자의 GitHub 저장소 활동 데이터(브랜치, 커밋 로그, 코드 변경 사항)를 분석하여 OpenAI/LLM을 통해 자동으로 기술 블로그 초안을 생성하고, 이를 편집 및 저장할 수 있는 개발자 전용 블로그 빌더 서비스.

## 2. 기술 스택 및 제약 사항
Gemini 에이전트는 코드 생성 및 아키텍처 설계 시 아래의 스택과 제약 사항을 **반드시** 준수해야 합니다.

### [Architecture & Core]
- **Frontend**: React + TypeScript (Vite 환경)
- **Backend**: Express.js (Node.js)
- **Communication**: Browser & Node Native `fetch` API 사용 (Axios 등 외부 라이브러리 사용 지양)
- **LLM Integration**: OpenAI 공식 Node.js SDK (`openai`) 활용
- **Data Storage**: Node.js 내장 `fs` 모듈을 통한 `posts.json` 로컬 파일 데이터 보관 (외부 DB 설치 및 연동 금지)

### [Strict Coding Rules]
- **Styling**: **CSS Modules 전용** (**외부 UI 및 Tailwind CSS 등 라이브러리 사용 엄금**)
- **State Management**: **React Hooks & Context API 내장 기능만 사용** (Redux, Zustand, Recoil 등 외부 상태 관리 라이브러리 금지)
- **Type System**: **Strict TypeScript** (`any` 타입 사용 절대 금지, 명확한 Interface 및 Type 명시 필수)
- **Icons**: 외부 아이콘 라이브러리(Lucide, FontAwesome 등) 사용 금지, **순수 SVG 코드로 직접 구현**
- **Security**: GitHub PAT(Personal Access Token) 및 OpenAI API Key는 절대로 프론트엔드에 노출하지 않으며, 오직 Express의 `.env`를 통해서만 관리하고 백엔드 서버에서 대행함.

## 3. 개발 컨벤션 (Convention)
- **Components**: PascalCase (예: `RepoSelector.tsx`, `BlogEditor.tsx`)
- **Naming**: 변수/함수는 `camelCase`, CSS 클래스명은 `kebab-case` 준수
- **Design Spec**: 사전에 정의된 컬러 토큰 및 타이포그래피 사양을 CSS Modules 내에서 일관되게 준수
- **Git Commit**: 단순한 기능 요약이 아닌 **회고형 커밋(Reflective Commit)** 구조를 준수한다.
  - **제목**: `<type>: #<이슈번호> <기능명>` (예: `feat: #5 리스트 뷰 구독 목록 안정화`)
  - **본문**: 아래 두 가지 키워드를 불릿 포인트(`-`)로 반드시 포함하여 작성한다.
    1. `- 확인내용:` (구현된 핵심 로직, 검증된 기능, 수정된 버그 상세 나열)
    2. `- 이해 안 됐던 부분:` (작업 중 발생한 에러, 복잡했던 상태 동기화 로직, 트러블슈팅 과정)

---

## 4. 에이전트 행동 수칙 (Agent Behavior Rules)
Gemini는 사용자와 대화하거나 코드를 생성할 때 다음 4가지 수칙을 엄격하게 이행해야 합니다.

1. **[구현 전략 선행]** 코드를 작성하기 전, 구현하려는 기능의 **전략 및 아키텍처(프론트-백엔드 간 데이터 흐름, 컴포넌트 구조)**를 사용자에게 먼저 명확히 설명하고 합의를 구한다.
2. **[작은 단위 분할]** 모든 코드는 한 번에 거대하게 작성하지 않고, 사용자가 **리뷰 및 단계별 테스트를 진행하기 좋은 작은 단위**로 끊어서 제공한다.
3. **[임의 결정 금지]** 기획서에 명시되지 않은 UI/UX 사양, 기능 스펙 또는 예외 처리 방식은 독단적으로 결정하지 말고, **반드시 사용자에게 먼저 질문하여 확인**한다.
4. **[디렉토리 생성 승인]** 새로운 디렉토리나 구조적 파일 변경이 필요할 경우, 실제 작업을 수행하기 전에 **사용자에게 파일 트리를 먼저 보고하고 승인**을 받는다.

---

## 🛠️ 5. 맞춤형 프롬프트 스킬 (AI Skills)

### 🌟 SKILL 1: Full-Stack-Feature-Planner
[Skill: Full-Stack-Feature-Planner]
구현할 기능: <예: 특정 커밋들을 선택해 AI에게 블로그 생성 요청하기>
지침:
행동 수칙 1번에 따라, 코드를 제공하지 말고 React(Client)와 Express(Server) 간의 데이터 이동 흐름, 필요한 Request/Response Body 구조, 컴포넌트 내 상태(State) 위치에 대한 구현 전략을 먼저 제안해줘.

### 🌟 SKILL 2: Strict-Component-Generator
[Skill: Strict-Component-Generator]
기능: <예: 커밋 로그들을 체크박스로 다중 선택하는 CommitList 컴포넌트>
요구사항:
1. any 타입을 절대 사용하지 말고 명확한 TypeScript Props Interface를 정의해줘.
2. 스타일링은 CSS Modules 방식을 사용하고, 클래스명은 kebab-case로 지어줘. (.module.css 코드 포함)
3. 외부 아이콘 대신 요구사항에 맞는 순수 SVG 코드를 컴포넌트 내부에 포함해줘.
4. 외부 상태 관리 라이브러리 없이 부모로부터 전달받은 상태나 내장 Hook만 사용해줘.

### 🌟 SKILL 3: Secure-Express-Router
[Skill: Secure-Express-Router]
기능: <예: OpenAI API를 호출하여 마크다운 초안을 생성하는 라우터>
요구사항:
1. Express 라우터 코드를 작성하되, .env에 보관된 API 키를 안전하게 사용하는 구조로 짜줘.
2. AI 응답 지연(Timeout) 및 OpenAI API 에러에 대응하는 try-catch 예외 처리와 상태 코드를 명확히 포함해줘.
3. 데이터는 로컬 `fs` 모듈을 사용해 `posts.json`에 비동기로 읽고 쓰는 로직을 반영해줘.

### 🌟 SKILL 4: Reflective-Commit-Generator
[Skill: Reflective-Commit-Generator]
작업 내용: <예: 방금 작업한 코드의 주요 내용, 발생했던 에러, 해결 방법 등>
지침:
1. 제공된 작업 내용을 바탕으로 컨벤션 규칙에 맞는 커밋 메시지를 작성해줘.
2. 제목은 `<type>: #<이슈번호> <제목>` 포맷으로 작성해.
3. 본문은 반드시 `- 확인내용:`과 `- 이해 안 됐던 부분:` 두 가지 섹션으로 나누어 작성해.
4. 특히 '이해 안 됐던 부분'에는 작업 중 겪었던 복잡한 로직(예: useEffect 상태 동기화)이나 에러 해결 과정을 개발자의 시선에서 구체적으로 기록해줘.