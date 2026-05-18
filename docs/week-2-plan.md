# Week 2 Plan

## Goal

2주차 목표는 1주차에 잡은 설계를 실제 동작 흐름으로 연결하는 것이다. 핵심은 GitHub 데이터 선택부터 LLM 초안 생성, 편집, 저장된 포스트 확인까지 한 번에 이어지는 사용자 경험을 만드는 것이다.

## Implementation Scope

- Express 서버에서 GitHub API 요청 처리
- Repository 목록 조회
- Branch 목록 조회
- Commit 목록 및 Commit 상세 조회
- 선택한 Commit 데이터를 LLM 입력 형태로 정리
- Express 서버에서 LLM API 요청 처리
- LLM 응답을 제목, 요약, 본문 초안으로 변환
- React UI에서 Repository, Branch, Commit 선택 흐름 구현
- AI 초안 생성 버튼과 로딩/실패 상태 구현
- Blog Editor에서 제목, 요약, 본문 편집
- 저장된 포스트 카드 목록 구현
- 저장된 포스트 다시 열기와 발행 상태 전환 초안 구현

## Optional Scope

- GitHub GraphQL API 검토
- Diff 요약 고도화
- 로컬 파일 또는 DB 기반 저장
- Markdown 미리보기
- 발행 대상 블로그 플랫폼 연동

## Verification

- Repository 선택부터 초안 생성까지 수동으로 한 번 통과한다.
- 생성된 초안을 사용자가 수정하고 저장할 수 있는지 확인한다.
- 저장된 포스트가 카드 목록에 표시되는지 확인한다.
- GitHub token과 LLM API key가 클라이언트 코드에 포함되지 않았는지 확인한다.
- `.env`가 커밋 대상에 포함되지 않는지 확인한다.
