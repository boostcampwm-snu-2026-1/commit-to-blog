# Verification Report

## Scope

검증 대상은 1번부터 6번 체크리스트까지 구현된 AI-Blog MVP 뼈대다.

검증 범위:

- 문서와 주차별 계획
- 서비스 설계
- GitHub API 서버 라우트
- LLM 초안 생성 서버 라우트
- React 블로그 작성 UI
- 저장된 포스트 API와 카드 UI
- 프로젝트 skill과 AI workflow

## Automated Checks

아래 명령을 기본 검증으로 사용한다.

```bash
npm.cmd run typecheck
npm.cmd run build
```

기대 결과:

- TypeScript 타입 오류 없음
- Vite production build 성공

이번 검증 결과:

- `npm.cmd run typecheck`: 통과
- `npm.cmd run build`: 통과

## API Smoke Checks

서버 실행:

```bash
npm.cmd run start:server
```

확인 항목:

- `GET /api/health`가 `200`을 반환한다.
- `POST /api/posts`로 테스트 포스트를 저장할 수 있다.
- `GET /api/posts`로 저장된 포스트 목록을 조회할 수 있다.
- `PATCH /api/posts/:id/status`로 `published` 상태 전환이 가능하다.
- `POST /api/llm/drafts`에 빈 body를 보내면 `400 INVALID_DRAFT_REQUEST`를 반환한다.

이번 검증 결과:

- health: `200`
- post create: `saved`
- post list: `1`개 반환
- post status patch: `published`
- invalid draft request: `400`

## Browser Smoke Checks

클라이언트 실행:

```bash
npm.cmd run dev -- --host 127.0.0.1 --port 5173 --strictPort true
```

확인 항목:

- `http://127.0.0.1:5173`에서 React 화면이 열린다.
- Repository, Branch, Commit, Generate, Draft editor, Saved posts 영역이 보인다.
- `.env`가 없거나 token이 없을 때 Repository 영역에 오류 상태가 표시된다.
- 초안 생성 버튼은 Commit이 선택되기 전까지 비활성화된다.
- 제목, 요약, 본문 입력 필드는 직접 수정 가능하다.
- 저장된 포스트 카드는 저장 API가 동작할 때 목록에 표시될 구조를 가진다.

이번 검증 결과:

- `GET /api/health`: `200`
- `GET http://127.0.0.1:5173`: `200`

## Manual End-to-End Scenario

실제 GitHub/LLM end-to-end 검증은 `.env`에 실제 값을 넣은 뒤 수행한다.

필요한 값:

- `GITHUB_TOKEN`
- `OPENAI_API_KEY`
- `OPENAI_MODEL`

시나리오:

1. Repository 목록에서 저장소를 선택한다.
2. Branch 목록에서 대상 브랜치를 선택한다.
3. Commit 목록에서 하나 이상의 Commit을 선택한다.
4. AI 초안 생성을 실행한다.
5. 제목, 요약, 본문을 수정한다.
6. 포스트를 저장한다.
7. 저장된 포스트 카드에서 다시 편집을 누른다.
8. 수정 저장을 실행한다.
9. 발행 버튼으로 상태를 `published`로 바꾼다.

현재 제약:

- 실제 token과 API key가 없으면 GitHub 목록 조회와 LLM 초안 생성은 live 검증할 수 없다.
- 저장된 포스트는 서버 메모리에만 저장되므로 서버 재시작 시 사라진다.

## Security Checks

확인 기준:

- `.env`는 `.gitignore`에 포함되어 있다.
- `.env.example`에는 변수명만 있고 실제 값은 없다.
- GitHub token과 LLM API key는 `server/config/env.ts`에서만 읽는다.
- 클라이언트는 `/api/*` 경로만 호출한다.
- 코드/문서에 실제 token 패턴이 없어야 한다.

검색 대상:

- 실제 GitHub token prefix
- 실제 OpenAI token prefix
- source file 안의 환경 변수 값 대입 패턴

## Remaining Risks

- 실제 GitHub rate limit과 권한 오류는 실제 token으로 추가 확인해야 한다.
- OpenAI 모델별 JSON 응답 호환성은 실제 `OPENAI_MODEL` 값으로 확인해야 한다.
- 저장소는 memory store라 데이터 유지 기능은 아직 제한적이다.
- PR 전에는 실제 브라우저에서 한 번 더 수동 흐름을 확인하는 것이 좋다.
