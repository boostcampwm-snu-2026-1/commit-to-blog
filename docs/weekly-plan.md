# Weekly AI Workflow Plan

## 수행 상태

| 항목 | 상태 | 산출물 |
| --- | --- | --- |
| AI 개발 workflow 정립 | 완료 | `README.md`, `docs/weekly-plan.md` |
| Skill 적용 | 완료 | `.codex/skills/service-design-review/SKILL.md`, `docs/design-review.md` |
| Hook 적용 | 완료 | `.githooks/pre-commit` |
| 서비스 구조 설명 | 완료 | `README.md`, `docs/architecture.md` |
| PR 작성 workflow | 완료 | `.github/pull_request_template.md` |

## 학습 목표

AI를 활용하기 위한 설계 과정을 이해하고, 반복 가능한 Agent 개발 workflow를 만든다.

## 이번 주 기능 개발 리스트

1. AI 개발 workflow 정립
   - 분석, 설계, 구현, 검증, PR 정리 단계를 고정한다.
   - 기능 구현보다 설계 산출물을 먼저 남긴다.

2. Skill 적용
   - `.codex/skills/service-design-review/SKILL.md`를 사용한다.
   - 구현 전에 요구사항, 영향 범위, 검증 방법을 먼저 정리한다.

3. Hook 적용
   - `.githooks/pre-commit`을 사용한다.
   - 커밋 전 backend ruff, frontend lint/typecheck를 실행해 품질 기준을 자동 확인한다.

4. 서비스 구조 설명 정리
   - FE, BE, API 호출, DB, 외부 API 역할을 README와 문서에 정리한다.
   - 내가 수정한 기능이 어느 모듈에 들어가는지 설명할 수 있게 만든다.

5. PR 작성 workflow 완성
   - 완료 작업, 분석/설계 과정, 막혔던 순간, 새로 알게 된 것, 다음 개선점을 기록한다.

## 이슈별 개발 계획

### Issue 1. Workflow 문서화

- 목표: 나만의 AI 개발 절차를 README와 문서에 정리한다.
- 설계 질문: 작업 시작 전에 무엇을 확인해야 하는가?
- 완료 조건: README에 workflow 요약이 있고, `docs/weekly-plan.md`에 세부 계획이 있다.
- 검증: 문서 링크가 깨지지 않고 PR 본문에 그대로 요약할 수 있다.

### Issue 2. Skill 기반 설계 단계 적용

- 목표: 구현 전 분석을 강제하는 Skill을 만든다.
- 설계 질문: AI가 바로 코딩하지 않고 먼저 확인해야 할 항목은 무엇인가?
- 완료 조건: `.codex/skills/service-design-review/SKILL.md`가 존재한다.
- 검증: 새 작업을 시작할 때 Scope, Architecture impact, Verification을 먼저 작성한다.

### Issue 3. Hook 기반 품질 확인

- 목표: 커밋 전 반복 검증을 자동화한다.
- 설계 질문: 너무 무겁지 않으면서 실수를 잡는 최소 검증은 무엇인가?
- 완료 조건: `.githooks/pre-commit`이 backend/frontend 핵심 품질 게이트를 실행한다.
- 검증: `sh -n .githooks/pre-commit`으로 문법 확인 후 `git config core.hooksPath .githooks`로 활성화할 수 있다.

### Issue 4. 서비스 아키텍처 설명

- 목표: 내가 구현한 서비스 구조를 설명할 수 있게 만든다.
- 설계 질문: 사용자 액션이 FE, API, BE service, DB, 외부 API를 어떻게 통과하는가?
- 완료 조건: README에 architecture 요약이 있다.
- 검증: GitHub 로그인부터 포스트 저장까지의 흐름을 말로 설명할 수 있다.

### Issue 5. PR 작성 workflow 고정

- 목표: 매주 PR에 설계 과정과 회고를 빠뜨리지 않도록 템플릿을 만든다.
- 설계 질문: 결과만 쓰지 않고 분석 과정과 막힌 순간을 어떻게 남길 것인가?
- 완료 조건: `.github/pull_request_template.md`에 완료 작업, 분석/설계, 막힌 점, 배운 점, 다음 개선점 항목이 있다.
- 검증: 새 PR을 만들 때 템플릿이 자동으로 표시되고, 완료하지 않은 작업을 제외할 수 있다.

## 나의 Agent 개발 Workflow

1. 요구사항 재진술: 사용자가 원하는 결과와 제출 조건을 한 문장으로 정리한다.
2. 구조 탐색: `rg`, `sed`, `git status`로 기존 파일, 변경 이력, 모듈 경계를 확인한다.
3. 이슈 분리: 한 번에 구현하지 않고 인증, API, UI, CI, 문서처럼 작은 단위로 나눈다.
4. 설계 기록: 변경 전 Scope, 영향 범위, 검증 방법을 작성한다.
5. 구현: 기존 convention을 따라 최소 변경으로 구현한다.
6. 검증: backend, frontend, E2E, migration, Docker 중 변경 범위에 맞는 gate를 실행한다.
7. 회고: 막힌 점, AI에게 다시 물은 방식, 다음 개선점을 PR에 남긴다.

## Skill / Hook 적용 방식

- Skill: `service-design-review`
  - 구현 전 분석 질문을 빠뜨리지 않기 위한 설계용 Skill이다.
  - 영향 레이어와 검증 명령을 먼저 정한 뒤 작업한다.

- Hook: `.githooks/pre-commit`
  - 커밋 직전에 품질 기준을 확인하는 자동화 장치다.
  - 활성화 명령:

```bash
git config core.hooksPath .githooks
```

## PR에 적을 Workflow 요약

이번 주에는 AI에게 바로 구현을 맡기기보다, 먼저 요구사항을 이슈 단위로 나누고 각 이슈마다 영향 범위와 검증 방법을 정리했다. 구현 전에는 `service-design-review` Skill로 FE/BE/API/DB 경계를 확인했고, 커밋 전에는 hook으로 lint/typecheck를 확인하도록 구성했다. 이를 통해 AI 작업 결과를 단순 코드 생성이 아니라 설계, 구현, 검증, 회고가 이어지는 workflow로 만들었다.

## 완료 증빙

- 설계 기록: `docs/design-review.md`
- 서비스 구조 설명: `docs/architecture.md`
- Skill: `.codex/skills/service-design-review/SKILL.md`
- Hook: `.githooks/pre-commit`
- PR 템플릿: `.github/pull_request_template.md`
- hook 활성화 명령: `git config core.hooksPath .githooks`
