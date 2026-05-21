# Service Design Review

이 문서는 `.codex/skills/service-design-review/SKILL.md`를 적용해 작업 전에 남기는 설계 기록이다.

## Goal

AI를 활용한 개발 workflow를 프로젝트 안에 정착시키고, 기능 구현 전에 분석/설계/검증 단계를 먼저 거치도록 만든다.

## Scope

변경하는 것:

- README에 AI 개발 workflow, Skill, Hook, 서비스 구조를 설명한다.
- `docs/weekly-plan.md`에 이번 주 과제 수행 계획과 이슈별 설계 기준을 기록한다.
- `.codex/skills/service-design-review/SKILL.md`로 설계 검토 Skill을 정의한다.
- `.githooks/pre-commit`으로 커밋 전 품질 확인 hook을 둔다.
- `.github/pull_request_template.md`로 PR 회고 형식을 고정한다.
- `docs/architecture.md`에 FE/BE/API/DB 흐름을 설명한다.

변경하지 않는 것:

- 실제 제품 기능의 동작 방식은 변경하지 않는다.
- 인증, API, DB schema, UI 동작은 이번 문서화 작업의 범위가 아니다.

## Architecture Impact

- Frontend: 구조 설명 대상이다. 코드 변경은 하지 않는다.
- Backend: 구조 설명 대상이다. 코드 변경은 하지 않는다.
- API: 호출 흐름과 책임 경계를 문서화한다.
- Database: SQLModel/Alembic 역할을 문서화한다.
- CI/CD: 기존 검증 명령과 hook의 관계를 설명한다.
- Docs: README, weekly plan, architecture, PR template가 이번 작업의 핵심 산출물이다.

## Acceptance Criteria

- README에서 workflow, Skill, Hook, Architecture를 한 번에 확인할 수 있다.
- `docs/weekly-plan.md`에 이슈별 계획과 완료 상태가 있다.
- `docs/architecture.md`를 읽으면 GitHub 로그인부터 포스트 저장까지 흐름을 설명할 수 있다.
- PR 템플릿에 완료 작업, 분석/설계, 막힌 점, 배운 점, 다음 개선점 항목이 있다.
- hook 문법이 유효하고, 커밋 전 품질 게이트를 실행할 수 있다.

## Verification

```bash
sh -n .githooks/pre-commit
git config core.hooksPath .githooks
.githooks/pre-commit
```

## Risks and Tradeoffs

- hook에 전체 test/E2E를 넣으면 커밋이 지나치게 느려질 수 있어 lint/typecheck 중심으로 제한했다.
- 상세 검증은 CI와 운영 문서의 production gates가 담당한다.
- Skill은 자동 실행 장치가 아니라 작업 전 체크리스트이므로 PR과 문서에 사용 흔적을 남겨야 한다.

## Workflow Problems and Improvements

- 문제점: 처음에는 기능 구현과 제출 산출물 정리가 섞여 있어 과제의 핵심인 설계 과정이 잘 드러나지 않았다.
  - 개선: `docs/weekly-plan.md`, `docs/design-review.md`, `docs/architecture.md`로 계획, 설계 리뷰, 구조 설명을 분리했다.
- 문제점: PR 본문과 스크린샷은 템플릿만 있고 실제 제출 증빙이 부족했다.
  - 개선: `docs/pr-description.md`에 채워진 PR 본문 초안을 만들고, `docs/assets/commitgram-workflow-home.png`를 추가했다.
- 문제점: Docker가 없는 환경에서는 compose 기반 검증을 바로 수행할 수 없었다.
  - 개선: backend/frontend 개발 서버를 직접 실행하고 Playwright로 동일한 mock 로그인 화면을 캡처하는 대체 검증 경로를 사용했다.

## PR Notes

- 완료 작업: workflow 문서화, Skill 정의, hook 추가, architecture 설명, PR 템플릿 작성
- 막힌 점: 기능 구현보다 설계 산출물 중심으로 과제를 해석하는 범위 결정
- 해결 방식: README에는 요약, docs에는 세부 기록, hook/skill은 실제 repo artifact로 분리
- 새로 알게 된 점: AI workflow는 프롬프트만이 아니라 Skill, hook, 검증 gate 같은 구조적 장치로 고정할 수 있다.
