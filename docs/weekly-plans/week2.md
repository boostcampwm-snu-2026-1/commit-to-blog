# 2주차 계획: 개발과 검증

## 목표

- mock 기반 전체 기능을 실제 서비스 구조로 구현한다.
- GitHub API와 Claude API를 토큰 기반으로 교체 가능한 서비스 계층에 둔다.
- PostgreSQL, Docker Compose, `.env` 기반 실행 환경을 완성한다.

## 개발 항목

- FastAPI API 구현: 저장소, 브랜치, 커밋, 초안 생성, 포스트 CRUD, 발행 상태 변경
- SQLModel 모델 및 PostgreSQL 연결
- Next.js 화면 구현: 저장된 포스트, 포스트 작성, 편집기
- SNS형 MVP 화면 강화: repository story, feed card, composer preview, publish action
- Dockerfile 및 Docker Compose 작성
- `.env.example` 작성
- 테스트와 브라우저 검증 수행

## 완료 조건

- `pytest` 성공
- Swagger `/docs` 200 응답
- `npm run build` 성공
- Chrome에서 저장된 포스트 카드와 포스트 작성 플로우 확인
- `.env`는 커밋하지 않고 `.env.example`만 제공
