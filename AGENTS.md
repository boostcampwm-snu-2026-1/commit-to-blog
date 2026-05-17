# AGENTS.md

## 프로젝트 컨셉
- 서비스명: Smart Blog - AI Tutor
- 핵심 아이디어: GitHub 커밋 Diff를 기반으로 AI가 시니어 개발자처럼 디펜스 질문을 던지고, 사용자의 답변/힌트/해설 과정을 학습 기록(TIL)형 블로그 초안으로 전환한다.
- 차별점: 단순 커밋 요약이 아니라 "왜 그렇게 구현했는지", "대안은 무엇인지"를 묻는 인터뷰 중심 흐름으로 개발자의 복기와 성장을 유도한다.

## 사용자 흐름
1. 저장소/커밋 선택
- GitHub 저장소 목록과 커밋 목록을 조회한다.
- 사용자가 리뷰할 커밋 1개를 선택한다.

2. AI 튜터 인터뷰 룸(핵심)
- 선택된 Diff를 분석해 AI가 고품질 질문 1~2개를 생성한다.
- 사용자 액션:
  - 답변 제출
  - 힌트 보기
  - 모르겠어요(해설 보기)
  - 질문 스킵(일반 요약 모드)

3. 초안 검토/수정/발행
- 인터뷰 경로에 맞춰 마크다운 초안을 자동 생성한다.
- 사용자가 수정 후 저장/발행한다.
- 저장된 포스트는 카드형 목록으로 조회하고 재편집할 수 있다.

## 기술 스택
- 프론트엔드(Client)
  - React
  - TypeScript
  - 스타일링: Tailwind CSS
  - UI: Shadcn UI
  - 상태/데이터: TanStack Query + 로컬 상태
  - 에디터: 마크다운 편집기 + 미리보기

- 백엔드(Server)
  - Node.js + Express.js
  - TypeScript
  - GitHub API/LLM API 서버 오케스트레이션
  - 유효성 검증: Zod
  - 로깅: Pino(또는 동급 구조화 로거)

- AI/외부 API
  - LLM: Gemini API 무료 티어(기본), 필요 시 모델은 AI Studio에서 가용한 경량 모델 사용
  - GitHub API: 저장소/커밋/Diff 조회

- 저장소(데이터)
  - 기본: MongoDB
  - ODM: Mongoose
  - 컬렉션(초안): users, interviewSessions, interviewTurns, posts

## 프로젝트 구조 원칙
- 모노레포 기반으로 Client/Server/Shared를 분리한다.
- 권장 구조:
  - `apps/client`: React 앱
  - `apps/server`: Express API 서버
  - `packages/shared`: 공통 타입/Zod 스키마/유틸
  - `docs`: 요구사항/체크리스트/skill 문서
  - `infra`: 로컬 인프라(docker-compose 등)

## 아키텍처 원칙
- 필수 요청 흐름: `Browser(UI) -> React Client -> Express Server -> GitHub API / LLM API`
- 민감정보(`GITHUB_TOKEN`, `GEMINI_API_KEY`)는 서버에서만 관리한다.
- GitHub/LLM API를 클라이언트에서 직접 호출하지 않는다.
- 프롬프트와 AI 워크플로우는 개발 중 지속적으로 개선한다.

## AI 워크플로우 규약
- 시스템 페르소나: 주니어 코드를 리뷰하는 엄격한 시니어 엔지니어
- 최초 질문 생성 응답은 구조화된 JSON 형식으로 받는다.
- 인터뷰 출력 필드 예시:
  - `question`
  - `expectedAnswer`
  - `hint`
  - `conceptTags`
  - `feedback`
- 초안 템플릿 분기:
  - 답변 성공: 구현 내용 + 설계 의도 + AI 피드백
  - 모르겠어요: 구현 내용 + 막힌 지점 + 새로 배운 개념(오답노트)
  - 스킵: 커밋 요약/릴리즈노트형 정리

## Skill 문서 규약
- `docs/skill.md`를 생성하고 AI 인터뷰 품질 기준을 명시한다.
- 포함 항목:
  - 목적
  - 입력(예: diff, repo, commit, userAnswer)
  - 출력 JSON 스키마
  - 평가 기준(정확성/난이도/학습가치)
  - 금지사항(근거 없는 추측, 민감정보 노출)

