# 12주차 계획 — 개발 위주

> 11주차 산출물 위에서 실제 기능을 완성한다.
> 11주차 [`plan-week11.md`](./plan-week11.md) 의 설계·프로토타입을 전제로 한다.

---

## 목표

1. PDF에 명시된 3가지 화면을 **사용 가능한 수준**으로 구현한다.
   1. 블로그 생성 (저장소 → 브랜치 → 커밋 → AI 요약 → 편집기)
   2. 저장된 포스트 카드 목록
   3. 포스트 상세 편집 + 발행
2. OpenAI Chat Completions API와 실제 연동한다.
3. AI workflow / `feature-scaffold` Skill 을 사용해 반복 작업을 자동화한다.

## 우선순위 (Must → Should → Could)

### Must (반드시 완성)
- `GET /api/repos/:owner/:repo/branches` — 선택한 저장소의 브랜치 목록
- `GET /api/repos/:owner/:repo/commits?branch=...` — 선택한 브랜치의 최근 커밋
- `POST /api/posts/draft` — 선택된 커밋 + diff 를 LLM에 보내 블로그 초안 반환
- React: 저장소 검색/선택 → 브랜치 드롭다운 → 커밋 카드 리스트 → AI 요약 패널
- React: 저장된 포스트 카드 목록 (in-memory + JSON 파일 영속화)
- 편집기에서 초안 수정 → "발행하기" 클릭 시 상태가 `published` 로 변경

### Should (있으면 좋음)
- 커밋 다중 선택 → 묶음 요약
- 마크다운 미리보기
- 발행된 포스트의 공유용 URL (`/posts/:id` 정적 페이지)

### Could (시간 남으면)
- 다크 모드
- 포스트 검색
- 발행된 포스트를 GitHub Issues/Discussions 로 push (선택)

## 일정 (5일)

- **Day 1** — `branches`, `commits` 엔드포인트 + UI (저장소 → 브랜치 → 커밋 선택 플로우)
- **Day 2** — LLM 연동 (`POST /api/posts/draft`), 프롬프트 정형화, 편집기 폼
- **Day 3** — 저장된 포스트 CRUD (`GET/PUT /api/posts`), 카드 목록 페이지
- **Day 4** — 발행 흐름, 에러/로딩 상태, 시각 디테일
- **Day 5** — 테스트, 데모용 스크린샷, PR 마무리

## 12주차에서 살펴볼 결정 포인트

- LLM 프롬프트 템플릿을 어디에 둘 것인가 (`apps/server/services/llm/prompts/`)
- diff 크기가 큰 커밋의 토큰 절감 전략 (truncation? hunk 우선순위?)
- 발행된 포스트의 영속화 매체 — JSON 파일 유지 vs SQLite 도입 여부
- 사용자가 같은 커밋으로 두 번 생성 시 캐시할지 매번 다시 요청할지

## 리스크

- LLM 호출 비용: 개발 중에는 `gpt-4o-mini` 로 고정, 캐시 적용.
- GitHub Rate Limit: 인증된 토큰 사용 시 시간당 5,000 요청 — 정상 개발 분량으로는 안전. 그래도 클라이언트에서 디바운스.
- 발표 직전 자동 머지 워크플로우(`auto-merge.yml`)가 5/24 (일) 09:10 KST 에 다시 발동 — 그 전에 완료 PR 만 라벨 정리.
