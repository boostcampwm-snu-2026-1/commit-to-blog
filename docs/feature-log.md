# Feature Log

## F-01 Repository Selection

- 확인 내용: GitHub Repository 리스트를 backend API에서 제공한다.
- 구현 근거: mock mode에서 키 없이도 repository list를 반환한다.

## F-02 Branch and Commit Selection

- 확인 내용: 선택 저장소의 브랜치와 커밋 로그를 조회하고 UI에서 선택할 수 있다.

## F-03 AI Draft Generation

- 확인 내용: 선택 커밋을 Claude Messages API 형식의 service layer로 전달해 블로그 초안을 생성한다.
- 개발 모드: `USE_MOCKS=true`일 때 deterministic mock draft를 반환한다.

## F-04 Editor and Save

- 확인 내용: 생성된 초안을 제목/요약/본문 편집 후 저장한다.

## F-05 Saved Posts

- 확인 내용: 저장된 글을 카드형 목록으로 보여주고 branch tag, summary preview, date, edit/publish action을 제공한다.

## F-06 Environment and Secrets

- 확인 내용: `.env.example`에는 dummy key만 포함하고 실제 `.env`는 커밋 대상에서 제외한다.

## F-07 Official API Syntax Refresh

- 확인 내용: GitHub REST API version header를 `2026-03-10`으로 갱신하고 branch/commit/detail 엔드포인트를 공식 문서 기준으로 정리했다.
- 확인 내용: Claude 호출은 공식 Python SDK의 `client.messages.create(...)` 문법을 유지하고 모델은 `.env`로 교체 가능하게 했다.

## F-08 Social MVP Experience

- 확인 내용: 저장된 포스트를 SNS 피드 카드로 보여주고, repository story rail, post studio, composer preview, engagement action을 제공한다.
