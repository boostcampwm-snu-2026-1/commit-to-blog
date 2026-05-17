# 1주차 (~ 2026-05-17) — 설계 + GitHub 연동 + AI 초안 생성

## 설계
- [ ] MVP scope 확정
- [ ] 도구 선정 (FE/BE/스타일/저장소/LLM/인증)
- [ ] 데이터 모델 + REST API 명세
- [ ] 디렉토리 구조
- [ ] AI workflow 초안
- [ ] `docs/design.md`

## 구현
- [ ] 프로젝트 boilerplate (client + server + `.env.example` + `.gitignore`)
- [ ] GitHub 인증
- [ ] `GET /repos`
- [ ] `GET /repos/:repo/branches`
- [ ] `GET /repos/:repo/commits?branch=`
- [ ] `GET /repos/:repo/commits/:sha`
- [ ] `POST /drafts/generate` (LLM 연동 + 프롬프트 + 큰 diff 축약)
- [ ] 거친 UI: repo → branch → commits → 초안 생성 → 결과 표시
