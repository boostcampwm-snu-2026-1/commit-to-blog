# API Integration Research

검색일: 2026-05-13

## GitHub REST API

공식 문서 기준으로 GitHub REST API는 버전 헤더를 명시한다.

- Base URL: `https://api.github.com`
- Recommended accept header: `Accept: application/vnd.github+json`
- Version header: `X-GitHub-Api-Version: 2026-03-10`
- Auth header: `Authorization: Bearer <YOUR-TOKEN>`

적용한 엔드포인트:

- Authenticated repository list: `GET /user/repos`
- Branch list: `GET /repos/{owner}/{repo}/branches`
- Commit list: `GET /repos/{owner}/{repo}/commits?sha={branch}`
- Commit detail and changed files: `GET /repos/{owner}/{repo}/commits/{ref}`

참고 공식 문서:

- https://docs.github.com/en/rest/repos/repos?apiVersion=latest
- https://docs.github.com/en/rest/branches/branches?apiVersion=latest
- https://docs.github.com/en/rest/commits/commits

## Claude Messages API

Anthropic 공식 SDK 문서 기준으로 Python SDK는 `anthropic.Anthropic()` 또는 async 환경의 `AsyncAnthropic` client를 만들고 `client.messages.create(...)`를 호출한다.

적용한 호출 형태:

```python
response = await client.messages.create(
    model=settings.anthropic_model,
    max_tokens=1400,
    system="...",
    messages=[
        {
            "role": "user",
            "content": "...",
        }
    ],
)
```

기본 모델은 공식 SDK quick start 예시에 맞춰 `.env.example`에 `claude-opus-4-7`로 둔다. 실제 비용/성능 기준은 `.env`에서 `ANTHROPIC_MODEL`로 교체한다.

참고 공식 문서:

- https://platform.claude.com/docs/en/api/overview
- https://platform.claude.com/docs/en/api/client-sdks
- https://platform.claude.com/docs/en/build-with-claude/working-with-messages

## Mock-first Policy

`USE_MOCKS=true`이면 GitHub/Claude 키 없이도 다음 흐름이 동작해야 한다.

1. Repository 목록 조회
2. Branch 목록 조회
3. Commit 목록 및 변경 파일 요약 조회
4. LLM 블로그 초안 생성
5. Post 저장, 수정, 발행

실제 API 전환 시에도 프론트엔드는 변경하지 않는다. 외부 API 문법은 `backend/app/services/github.py`, `backend/app/services/llm.py`에만 존재한다.
