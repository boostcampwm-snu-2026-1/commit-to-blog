# 1주차 (2026-05-17 ~ 2026-05-23) — 설계 + GitHub 연동 + AI 초안 생성

## 목표
외부 의존성(GitHub API, LLM API)을 1주차에 모두 연동해 둔다. 1주차 말에는 거친 UI로라도 "repo 선택 → 커밋 선택 → 초안 markdown 반환"이 동작해야 한다.

## 설계 (앞쪽 2~3일)
- [ ] MVP scope 리스트 확정 (제외 항목 명시)
- [ ] 도구 선정 + 한 줄 이유
  - [ ] Frontend (React/Vite/TS, 스타일 도구, 에디터 라이브러리)
  - [ ] Backend (Express/TS, octokit, LLM SDK)
  - [ ] 데이터 보관 (JSON 파일 / SQLite 중 선택)
  - [ ] GitHub 인증 (PAT / OAuth 중 선택)
- [ ] 데이터 모델 정의 (Post, Repository, Branch, Commit)
- [ ] REST API 명세표 작성
- [ ] 디렉토리 구조 (`client/`, `server/`) — 파일명·역할까지
- [ ] AI workflow 초안 (각 단계에서 Claude를 어떻게 활용할지)
- [ ] 산출물: `docs/design.md`

## 구현
- [ ] 프로젝트 세팅: React+Vite+TS, Express+TS, `.env.example`, `.gitignore`
- [ ] GitHub 인증 동작 확인
- [ ] `GET /repos` — 내 repository 목록
- [ ] `GET /repos/:repo/branches` — 브랜치 목록
- [ ] `GET /repos/:repo/commits?branch=` — 커밋 목록 + 메타
- [ ] `GET /repos/:repo/commits/:sha` — 단일 커밋 diff
- [ ] `POST /drafts/generate` — 선택 커밋들 → LLM → markdown 초안 반환
- [ ] LLM 프롬프트 1차안 작성
- [ ] 큰 diff 잘라내기/축약 로직
- [ ] FE 거친 UI: repo 선택 → branch 선택 → commits 다중 선택 → "초안 생성" → 결과 텍스트 표시

## 검증
- [ ] 내 실제 repo로 한 번 끝까지 돌려보기 (스크린샷 또는 메모 남기기)
- [ ] 토큰이 `.env`로만 관리되고 git에 들어가지 않는지 확인

## 산출물
- `plans/week1.md` (이 파일, 체크 진행)
- `docs/design.md`
- `client/`, `server/` 골격
- 동작하는 GitHub 조회 + AI 초안 생성 흐름
