# 2주차 계획 (2026-05-24 ~ 2026-05-30)

## 목표

LLM 어댑터, 에디터, Saved Posts를 완성하고 검증 시나리오 3개를 통과시킨다. 마무리로 AI workflow 회고와 자체 Skill 정리.

---

## 전제

1주차에 완료되어야 할 것:
- Vite+React / Express 스캐폴드 동작
- GitHub API 라우트 4개 (`/repos`, `/branches`, `/commits` 목록·상세)
- `posts.json` CRUD 4개
- 클라이언트에서 레포→브랜치→커밋이 화면에 출력되는 상태

이게 안 되어 있으면 2주차 첫날에 먼저 정리.

---

## 2주차 개발 체크리스트

### A. LLM 어댑터 (`server/services/llm.js`)

- [x] LLM 제공자 선택 및 API 키 발급 (`.env`에 추가) — mock으로 시작, 실호출 제공자는 추후 결정
- [x] 어댑터 함수 시그니처 확정: `generateDraft({ commits }) → { title, content, summary }`
- [x] **mock 어댑터 먼저** — 실제 호출 없이 더미 마크다운 반환, UI 흐름부터 완성
- [ ] 실제 LLM 호출 구현 (단일 함수 교체) — anthropic/openai stub만 존재
- [x] 프롬프트 작성 — 커밋 메시지 + diff를 받아 블로그 톤의 마크다운 생성

### B. `POST /api/draft` 라우트

- [x] 요청에서 `commitShas` 받아 `services/github`로 각 커밋 상세 조회 (Promise.all 병렬)
- [x] 어댑터에 넘기고 응답 반환
- [x] 실패 시 명확한 에러 응답 (status code + message) — INVALID_INPUT/NOT_FOUND 등

### C. 에디터 (`PostEditor`)

- [x] title 단일 input
- [x] 단일 textarea (content/summary 작성) — textarea 값이 content/summary 모두에 저장
- [x] **글자수 카운터** (textarea 하단, 예: `148 chars`)
- [x] `[취소] [블로그 포스트로 저장 및 게시]` 하단 버튼
- [x] 저장 시 source(repo/branch/shas) 함께 전송
- [x] 저장 성공 → Saved Posts로 이동 + 토스트 (3초 자동 사라짐)

### D. Saved Posts 화면

- [ ] `PostCard` — title / branch 태그 / summary 2줄 / 날짜 / `[수정하기] [발행하기]` 버튼
- [ ] 빈 상태 ("아직 작성한 글이 없어요")
- [ ] 카드 클릭(또는 수정하기) → 에디터 진입 (mode=edit, PUT 호출)
- [ ] 발행 토글 (`status: draft ↔ published`)
- [ ] 삭제 (confirm 1회)
- [ ] 우상단 `[+ 블로그 생성]` CTA → Create Blog로 이동

### E. 에러·로딩 UX

- [ ] 단계별 로딩 인디케이터
- [ ] 전역 에러 배너 (PAT 오류, rate limit, 네트워크)

### F. 검증

- [ ] 시나리오 1 — Happy path 통과
- [ ] 시나리오 2 — 멀티 커밋 통과
- [ ] 시나리오 3 — 에러 친화성 통과
- [ ] README 정리 (실행법, .env 설정법)

### G. 학습 산출물

- [ ] AI workflow 문서 (`docs/ai-workflow.md`) — 어떤 식으로 Claude를 활용했는지
- [ ] 나만의 Claude Skill 1개 — 1주차/2주차 중 반복 패턴화한 것
- [ ] 1주차 대비 워크플로 개선점 회고

---


1. 문제를 만든다
- axi context

문제 (axi context x)

2. 답
3. testbench

4. 답 & testbench