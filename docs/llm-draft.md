# LLM Draft Generation

## Goal

선택한 GitHub Commit 데이터를 서버에서 수집하고, LLM 입력에 맞게 제한/정리한 뒤 편집 가능한 블로그 초안으로 변환한다. 클라이언트는 LLM API key나 diff 원문을 직접 다루지 않는다.

## Environment

`.env.example`에 필요한 변수 이름만 기록한다.

```txt
OPENAI_API_KEY=
OPENAI_MODEL=
```

실제 값은 `.env`에만 작성하고 커밋하지 않는다.

## Endpoint

### `POST /api/llm/drafts`

Request:

```json
{
  "repositoryFullName": "motoo42/commit-to-blog",
  "branchName": "feature/mission-docs-skills",
  "commitShas": ["commit-sha"],
  "language": "ko"
}
```

Response:

```json
{
  "draft": {
    "title": "블로그 제목",
    "summary": "요약 문장",
    "content": "Markdown 본문",
    "sourceCommitShas": ["commit-sha"]
  }
}
```

## Evidence Strategy

서버는 `commitShas`를 그대로 LLM에 보내지 않고, 각 commit의 상세 정보를 다시 조회해 evidence bundle을 만든다.

포함 정보:

- Repository 이름
- Branch 이름
- Commit sha
- Commit message
- 작성자와 날짜
- 변경 파일명
- 파일별 상태, 추가/삭제 줄 수
- 제한된 `patchSummary`

제한 규칙:

- 선택 가능한 commit 수는 최대 10개다.
- commit당 변경 파일은 최대 20개만 LLM 입력에 포함한다.
- 파일별 patch summary는 최대 1200자로 제한한다.
- 전체 evidence text는 최대 24000자로 제한한다.

## Prompt Policy

프롬프트는 다음 규칙을 포함한다.

- 단순 commit message 나열을 금지한다.
- 개발 블로그 독자를 대상으로 작성하게 한다.
- 기본 출력 언어는 한국어다.
- 근거 없는 내용을 꾸며내지 않도록 한다.
- 의도가 불명확하면 변경 사항 기반 추론임을 밝히게 한다.
- 결과는 `title`, `summary`, `content` JSON 형태로 반환하게 한다.

## Error Policy

- `OPENAI_API_KEY_MISSING`: 서버에 LLM API key가 없다.
- `OPENAI_MODEL_MISSING`: 서버에 사용할 모델명이 없다.
- `INVALID_DRAFT_REQUEST`: 요청 body가 올바르지 않다.
- `COMMITS_REQUIRED`: 선택된 commit이 없다.
- `TOO_MANY_COMMITS`: 선택 commit 수가 제한을 넘었다.
- `LLM_REQUEST_FAILED`: LLM API 요청 실패.
- `LLM_EMPTY_RESPONSE`: LLM이 빈 응답을 반환했다.
- `LLM_RESPONSE_PARSE_FAILED`: JSON 파싱 실패.
- `LLM_RESPONSE_INVALID`: `title`, `summary`, `content`가 없다.

## Verification

- LLM API key는 `server/config/env.ts`에서만 읽는다.
- LLM 호출은 `server/services/llmService.ts`에만 둔다.
- React 클라이언트는 이후 `/api/llm/drafts`만 호출한다.
- LLM 응답은 editor가 바로 사용할 수 있는 `BlogDraft`로 반환한다.
