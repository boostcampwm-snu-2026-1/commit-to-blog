# 1주차 계획: 기획 구체화와 설계

## 목표

- GitHub 활동 기반 개발 블로그 생성 서비스의 핵심 사용자 흐름을 확정한다.
- 프론트엔드, 백엔드, 데이터 구조, API 연동 방식을 설계한다.
- mock 기반으로 전체 흐름을 검증할 수 있는 얇은 구현을 만든다.

## 범위

- 저장소 목록 조회
- 브랜치 조회
- 커밋 선택
- AI 블로그 초안 생성
- 초안 편집 및 저장
- 저장된 포스트 카드 목록

## 데이터 구조

- Repository: `id`, `name`, `full_name`, `default_branch`
- Branch: `name`
- Commit: `sha`, `message`, `author`, `committed_at`, `url`
- BlogPost: `id`, `title`, `branch`, `summary`, `content`, `status`, `created_at`, `updated_at`

## 상태 흐름

1. 사용자가 저장소를 선택한다.
2. 선택 저장소 기준으로 브랜치와 커밋 목록을 불러온다.
3. 사용자가 분석할 커밋을 선택한다.
4. 백엔드가 GitHub 변경 정보와 커밋 메시지를 수집한다.
5. Claude API 형식의 LLM 서비스가 블로그 초안을 생성한다.
6. 사용자가 초안을 편집하고 저장한다.
7. 저장된 글 목록에서 수정 또는 발행 상태 전환을 수행한다.

## 검증

- Backend `pytest`
- Swagger `/docs` 접속
- Frontend `npm run build`
- Chrome GUI에서 Create Blog, Saved Posts 화면 확인
