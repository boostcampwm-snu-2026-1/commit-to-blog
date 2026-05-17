# Commit to Blog

GitHub 활동 데이터를 바탕으로 개발 블로그 초안을 생성하고, 사용자가 편집/저장/발행할 수 있게 만드는 AI-Blog 미션 프로젝트입니다.

## Mission Docs

- `Mission.md`: 11주차 미션 원문 요구사항을 상세 체크리스트로 정리한 기준 문서
- `checklist.md`: 실제 진행 상황을 7개 작업 단위로 관리하는 실행 체크리스트
- `docs/week-1-plan.md`: 1주차 목표, MVP 범위, 산출물, 검증 기준
- `docs/week-2-plan.md`: 2주차 목표, 구현 범위, 산출물, 검증 기준
- `docs/tech-stack.md`: 기술 스택 선택 이유와 보안 기준
- `docs/service-design.md`: 사용자 흐름, 데이터 모델, React/Express 구조, 상태 흐름, 저장 방식
- `docs/github-api.md`: GitHub API 서버 연동 방식, 응답 형태, 오류 정책
- `docs/llm-draft.md`: LLM 블로그 초안 생성 방식, 프롬프트 정책, 오류 정책
- `docs/ui-flow.md`: React 블로그 작성 UI 흐름과 상태 관리 기준
- `skills/`: 이 프로젝트에서 반복 사용할 AI 작업 스킬

## Development

```bash
npm install
copy .env.example .env
npm run dev
```

다른 터미널에서 API 서버를 실행합니다.

```bash
npm run dev:server
```

`.env`에는 실제 `GITHUB_TOKEN` 값을 넣되, 커밋하지 않습니다.
LLM 초안 생성을 사용하려면 `OPENAI_API_KEY`와 `OPENAI_MODEL`도 `.env`에 설정합니다.

## API Routes

- `GET /api/health`
- `GET /api/github/repositories`
- `GET /api/github/repositories/:owner/:repo/branches`
- `GET /api/github/repositories/:owner/:repo/commits?branch={branch}`
- `GET /api/github/repositories/:owner/:repo/commits/:sha`
- `POST /api/llm/drafts`

## Commit Rule

커밋 메시지는 `checklist.md`의 수행 항목 번호를 앞에 붙입니다.

```txt
No.{번호}: {concise English message}
```

예시:

```txt
No.1: add planning docs
No.7: add project skills
```
