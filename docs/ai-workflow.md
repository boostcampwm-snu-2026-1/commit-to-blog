# AI Workflow

## 반복 절차

1. 요구사항을 기능 번호로 나눈다.
2. 각 기능을 데이터, API, UI 상태, 검증 방법으로 분해한다.
3. mock으로 먼저 end-to-end 흐름을 만든다.
4. 외부 API는 서비스 계층에 숨기고 `.env`로 전환한다.
5. 구현 후 `pytest`, Swagger, frontend build, Chrome GUI로 검증한다.
6. 발견된 반복 절차는 `.codex/skills/github-blog-workflow/SKILL.md`에 반영한다.

## 이번 과제에서 사용한 패턴

- mock-first API integration
- service-layer isolation for external APIs
- prompt-to-artifact checklist
- GUI verification after successful build
