# 1주차 기술 선택 근거

## 대상
- React + Express + Gemini API(무료 티어) + GitHub API
- Tailwind CSS + Shadcn UI
- MongoDB + Mongoose

## 1) React + Express + Gemini API + GitHub API 선택 이유
- React: 컴포넌트 기반 UI 구성과 상태 분리가 용이해 Step 1~3 화면을 빠르게 분리 구현할 수 있다.
- Express: API 오케스트레이션( GitHub/LLM 중계 )에 단순하고 검증된 구조를 제공한다.
- Gemini API(무료 티어): 초기 비용 부담 없이 프롬프트/워크플로우 반복 실험이 가능하다.
- GitHub API: 저장소/커밋/diff를 공식 경로로 안정적으로 조회할 수 있다.
- 조합 관점: `Client(React)`와 `Server(Express)` 책임 분리가 명확하고, 민감정보를 서버에 고정하기 쉽다.

## 2) Tailwind CSS + Shadcn UI 선택 기준
- Tailwind CSS: 빠른 프로토타이핑과 일관된 디자인 토큰 관리에 유리하다.
- Shadcn UI: 접근성과 기본 상호작용이 준비된 컴포넌트를 조합해 구현 속도를 높인다.
- 기준: 1) 커스터마이즈 용이성 2) 구현 속도 3) 유지보수성 4) 디자인 일관성.
- 적용 방침: 공통 레이아웃/폼/버튼/카드/모달 등은 Shadcn 우선, 서비스 특화 UI는 Tailwind 유틸로 보완.

## 3) MongoDB + Mongoose 선택 이유 및 컬렉션/인덱스 초안
- MongoDB: 인터뷰 턴/초안 등 문서 중심 데이터 구조에 유연하게 대응 가능하다.
- Mongoose: 스키마/검증/모델 계층을 통해 빠르게 도메인 모델을 고정할 수 있다.

### 컬렉션 초안
- `users`
- `interviewSessions`
- `interviewTurns`
- `posts`

### 인덱스 초안
- `interviewSessions`: `{ userId: 1, createdAt: -1 }`
- `posts`: `{ userId: 1, updatedAt: -1 }`
- `interviewTurns`: `{ sessionId: 1, turnIndex: 1 }` (unique)

## 리스크/보완
- 무료 티어 LLM은 응답 품질 편차가 있으므로 프롬프트/리트라이 정책을 함께 설계한다.
- MongoDB 인덱스는 실제 조회 패턴 기반으로 2주차에 재조정한다.
