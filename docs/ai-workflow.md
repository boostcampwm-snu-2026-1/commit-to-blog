# AI Workflow

## Purpose

이 문서는 AI-Blog 미션을 진행하면서 반복 사용한 작업 방식을 정리한다. 이후 작업자는 기능 구현 전에 관련 skill과 문서를 먼저 읽고, 구현 후 검증 결과를 남긴다.

## Workflow Loop

1. `checklist.md`에서 이번 작업 번호를 고른다.
2. 작업 번호와 가장 가까운 skill을 읽는다.
3. `Mission.md`와 관련 `docs/*.md`를 확인한다.
4. 구현 범위를 작게 정한다.
5. 파일 구조가 바뀌면 `project-structure-architect.md` 기준으로 위치를 정한다.
6. 서버 기능은 Express route, service, type으로 나누어 구현한다.
7. React 기능은 page, component, service, type으로 나누어 구현한다.
8. 문서와 체크리스트 완료 근거를 함께 갱신한다.
9. `npm.cmd run typecheck`와 `npm.cmd run build`를 실행한다.
10. API smoke test와 보안 문자열 검색을 수행한다.
11. 커밋 메시지는 `No.{체크리스트 번호}: {concise English message}` 형식으로 작성한다.

## Skills Used

- `skills/project-structure-architect.md`: React/Express 파일 위치를 정할 때 사용했다.
- `skills/github-api-integrator.md`: GitHub API를 서버에만 두는 기준으로 사용했다.
- `skills/llm-draft-generator.md`: commit evidence, prompt, LLM 응답 파싱 기준으로 사용했다.
- `skills/smart-blog-ui-builder.md`: 첫 화면을 실제 작성 워크스페이스로 만드는 기준으로 사용했다.
- `skills/mission-verifier.md`: 마지막 검증 루프와 보안 확인 기준으로 사용했다.

## Commit Message Rule

```txt
No.{번호}: {concise English message}
```

Examples:

```txt
No.5: add blog writing ui
No.6: add saved posts
No.7: add verification docs
```

## Security Rule

- 실제 `.env` 값은 문서, 코드, 로그, 최종 보고에 쓰지 않는다.
- `GITHUB_TOKEN`, `OPENAI_API_KEY`, `OPENAI_MODEL`은 서버 환경 변수로만 읽는다.
- React 클라이언트는 `/api/*`만 호출한다.
- 보안 확인은 실제 GitHub token prefix, OpenAI token prefix, 환경 변수 값 대입 패턴을 검색한다.
- 검색 명령 문자열이 문서 자체에 걸리지 않도록 docs와 skills의 설명용 문구는 별도 확인한다.

## Verification Habit

기능 구현 후 아래를 기본 검증으로 수행한다.

```bash
npm.cmd run typecheck
npm.cmd run build
```

API가 포함된 작업은 서버를 실행한 뒤 health check와 관련 endpoint smoke test를 추가한다.
