# Tech Stack Decision

## Frontend

- React: 미션 요구사항의 저장소 선택, 커밋 선택, 편집기, 저장된 포스트 목록을 컴포넌트 단위로 나누기 좋다.
- TypeScript: GitHub 데이터, LLM 응답, BlogPost 상태를 명확한 타입으로 관리하기 좋다.
- Vite: React 개발 서버와 빌드 설정을 빠르게 시작하기 좋다.
- CSS Modules 또는 일반 CSS: 초기 미션에서는 디자인 시스템보다 명확한 화면 흐름이 우선이므로 단순한 스타일 도구를 먼저 사용한다.

## Backend

- Express: GitHub API와 LLM API 요청을 서버에서 처리하라는 미션 요구사항에 맞다.
- TypeScript: 서버 라우트, 외부 API 응답, 저장 데이터 구조를 프론트엔드와 일관되게 관리하기 좋다.
- Node fetch 또는 GitHub REST API wrapper: MVP에서는 Repository, Branch, Commit, Commit detail 조회가 핵심이므로 REST 기반 접근이 단순하다.

## AI And API

- LLM API는 Express 서버에서만 호출한다.
- LLM 입력에는 선택한 Commit 데이터만 포함한다.
- 긴 diff는 그대로 보내지 않고 파일 목록, 커밋 메시지, 핵심 patch 요약 중심으로 제한한다.
- 응답은 편집 가능한 `title`, `summary`, `content` 형태로 변환한다.

## Storage

- 초기 구현은 메모리 또는 localStorage 기반 저장으로 시작할 수 있다.
- 새로고침 후 유지가 필요해지면 서버 파일 저장 또는 DB를 검토한다.
- 저장 방식은 구현 시점에 한계를 문서화한다.

## Security

- `GITHUB_TOKEN`은 서버 `.env`에서만 읽는다.
- LLM API key도 서버 `.env`에서만 읽는다.
- `.env`는 커밋하지 않는다.
- `.env.example`에는 변수 이름만 남기고 실제 값은 쓰지 않는다.
- 토큰, key, private diff 내용은 로그와 문서에 남기지 않는다.
