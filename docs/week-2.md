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

- [ ] LLM 제공자 선택 및 API 키 발급 (`.env`에 추가)
- [ ] 어댑터 함수 시그니처 확정: `generateDraft({ commits }) → { title, content, summary }`
- [ ] **mock 어댑터 먼저** — 실제 호출 없이 더미 마크다운 반환, UI 흐름부터 완성
- [ ] 실제 LLM 호출 구현 (단일 함수 교체)
- [ ] 프롬프트 작성 — 커밋 메시지 + diff를 받아 블로그 톤의 마크다운 생성
- [ ] 토큰 절약: diff 길이 클리핑 (SHOULD)

### B. `POST /api/draft` 라우트

- [ ] 요청에서 `commitShas` 받아 `services/github`로 각 커밋 상세 조회
- [ ] 어댑터에 넘기고 응답 반환
- [ ] 실패 시 명확한 에러 응답 (status code + message)

### C. 에디터 (`MarkdownEditor`)

- [ ] textarea + react-markdown 미리보기 2단 레이아웃
- [ ] title 단일 input
- [ ] `[저장] [발행하기] [취소]` 하단 버튼
- [ ] 저장 시 source(repo/branch/shas) 함께 전송
- [ ] 저장 성공 → Saved Posts로 이동 + 토스트

### D. Saved Posts 화면

- [ ] `PostCard` — title / status 배지 / branch 태그 / summary 2줄 / 날짜
- [ ] 빈 상태 ("아직 작성한 글이 없어요")
- [ ] 카드 클릭 → 에디터 진입 (mode=edit, PUT 호출)
- [ ] 카드 메뉴 (편집 / 발행 토글 / 삭제 confirm)

### E. 에러·로딩 UX

- [ ] 단계별 로딩 인디케이터
- [ ] 전역 에러 배너 (PAT 오류, rate limit, 네트워크)
- [ ] LLM 실패 시 에디터에 "다시 생성" 버튼

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

## 권장 작업 순서

1. **mock 어댑터부터 끼워서 UI 전체 흐름 완성** (E2E 동작)
2. 실제 LLM 호출로 교체 (단일 파일)
3. 에디터·Saved Posts 디테일 다듬기
4. 에러·로딩 UX
5. 검증 시나리오 3개 돌리고 버그 잡기
6. 학습 산출물 정리 + 최종 commit

mock 우선이 핵심 — LLM 제공자 결정·키 발급이 늦어져도 다른 작업이 안 막힘.

---

## 리스크와 대비책

| 리스크 | 대비 |
|---|---|
| LLM API 키 발급 지연 | mock 어댑터로 모든 UI 흐름 선완성 |
| GitHub API rate limit | 개발 중에는 같은 응답 캐싱 (단순 메모리 Map) — 필요할 때만 |
| 프롬프트 품질 불만족 | 2주차 중반에 1회 튜닝, 완벽은 추구 X (학습 목표는 연동) |
| diff 너무 길어서 토큰 초과 | 파일별 patch 길이 상한 + 합계 상한 설정 |
| 시간 부족 | SHOULD 항목 잘라내기, MUST만 통과시키기 |

---

## "완성" 정의 (재확인)

1주차에서 정의한 검증 시나리오 3개를 모두 수동으로 통과 + README에 실행법 명시 + 주차별 계획 md 두 개 commit 포함 + Skill 1개 정리.
