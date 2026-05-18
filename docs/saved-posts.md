# Saved Posts

## Goal

생성 또는 편집한 블로그 초안을 저장하고, 카드 목록에서 다시 열어 수정하거나 발행 상태로 전환할 수 있게 한다.

## Server Routes

### `GET /api/posts`

저장된 포스트 목록을 최신 수정일 순서로 반환한다.

### `POST /api/posts`

새 포스트를 저장한다.

필수 필드:

- `title`
- `summary`
- `content`
- `repositoryFullName`
- `branchName`
- `commitShas`

### `GET /api/posts/:id`

저장된 포스트 하나를 반환한다.

### `PUT /api/posts/:id`

저장된 포스트의 제목, 요약, 본문, 출처 정보를 수정한다.

### `PATCH /api/posts/:id/status`

`saved` 또는 `published` 상태로 변경한다.

## Storage Decision

현재 구현은 Express 서버 메모리 저장소인 `server/services/postStore.ts`를 사용한다.

장점:

- 6번 체크리스트의 저장/목록/재편집/발행 흐름을 빠르게 검증할 수 있다.
- DB 설정 없이 React와 Express의 계약을 먼저 고정할 수 있다.

제약:

- 서버를 재시작하면 저장된 포스트가 사라진다.
- 사용자별 데이터 분리는 아직 없다.
- 실제 서비스로 확장하려면 파일 저장, SQLite, 또는 외부 DB로 교체해야 한다.

## UI Flow

1. 사용자가 AI 초안을 생성하거나 직접 제목/요약/본문을 작성한다.
2. Repository, Branch, Commit 출처가 있는 상태에서 저장 버튼을 누른다.
3. 저장 성공 시 카드 목록 맨 위에 포스트가 표시된다.
4. 사용자가 카드의 `다시 편집` 버튼을 누르면 editor에 저장된 내용이 로드된다.
5. 수정 후 `수정 저장`을 누르면 같은 post id가 갱신된다.
6. 사용자가 카드의 `발행` 버튼을 누르면 status가 `published`로 바뀐다.

## Verification

- 빈 제목, 요약, 본문은 저장하지 않는다.
- 출처 Repository, Branch, Commit이 없으면 저장하지 않는다.
- 저장 실패 시 편집 중인 내용은 유지한다.
- 카드에는 제목, 브랜치, 요약, 날짜, 상태가 표시된다.
- 발행된 포스트는 다시 발행 버튼이 비활성화된다.
