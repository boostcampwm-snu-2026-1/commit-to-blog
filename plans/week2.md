# 2주차 (2026-05-24 ~ 2026-05-30) — 편집기 + 저장/관리 + 마감

## 목표
1주차에 만든 핵심 흐름 위에 편집기, 저장/발행, Saved Posts UI를 얹어 사용자 가치를 완성한다. 새로 도입할 외부 의존성은 없다.

## 구현
- [ ] 편집기: 생성된 markdown 수정 (textarea + 미리보기 또는 라이브러리)
- [ ] 저장 로직 API
  - [ ] `POST /posts` — 초안 저장
  - [ ] `GET /posts` — 목록
  - [ ] `GET /posts/:id` — 단건
  - [ ] `PUT /posts/:id` — 수정
  - [ ] `PATCH /posts/:id/publish` — 발행 상태 변경
- [ ] 저장 방식 구현 (1주차에서 정한 JSON/SQLite)
- [ ] Saved Posts 화면: 카드 그리드 (브랜치 태그, 날짜, 미리보기, "새 초안 작성" 카드)
- [ ] 수정하기 / 발행하기 액션
- [ ] 라우팅 (My Blog / Saved Posts / 편집 화면)

## 완성도
- [ ] 에러/로딩/빈 상태 처리
  - [ ] GitHub 토큰 만료
  - [ ] LLM rate limit / 타임아웃
  - [ ] 큰 diff 처리
  - [ ] 빈 목록 상태
- [ ] 수동 시나리오 체크리스트 작성 후 통과시키기
- [ ] 핵심 API 통합 테스트 2~3개

## AI workflow / Skill
- [ ] 1~2주차에 반복된 패턴 1개 골라 Skill로 정식화
- [ ] AI workflow 회고: 무엇이 잘 됐고 무엇을 바꿀지 기록

## 마감
- [ ] README 업데이트 (실행 방법, 환경변수, 스크린샷)
- [ ] 회고 노트 작성

## 산출물
- `plans/week2.md` (이 파일, 체크 진행)
- 동작하는 앱 (Create Blog 전체 흐름 + Saved Posts 관리)
- Skill 1개
- 회고 노트
