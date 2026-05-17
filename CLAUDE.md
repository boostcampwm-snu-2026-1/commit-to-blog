# CLAUDE.md

## 프로젝트
GitHub PR/커밋을 LLM으로 블로그 초안화하는 서비스. 상세 설계는 [docs/week1-plan.md](docs/week1-plan.md), 진행상황은 [CHECKLIST.md](CHECKLIST.md).

## 구조
- `client/` — Vite + React + Tailwind (포트 5173)
- `server/` — Express + dotenv, BFF 역할 (포트 4000). GitHub/OpenAI 토큰 보호.
- `server/data/posts.json` — 1주차 임시 저장소 (2주차에 SQLite 검토)
- `docs/` — 주차별 플랜

## 규칙
- **토큰은 절대 클라이언트로 보내지 않는다.** GitHub/OpenAI 호출은 `server/src/services/`에서만.
- 신규 라우트는 `docs/week1-plan.md` §5 API 표를 따른다.
- 데이터 구조 변경 시 §4와 동기화.
- 1주차는 **설계 + 뼈대만**. 로직 구현은 2주차.

## 명령
- `npm run dev` — client + server 동시 실행 (concurrently)
- `npm run dev:client` / `npm run dev:server` — 개별 실행

## 작업 스타일
- 컴포넌트/엔드포인트 단위로 작게 검증. "돌아가니까 패스" 금지.
- 반복 패턴 발견 시 [CHECKLIST.md](CHECKLIST.md)의 Skill 계획 섹션에 메모.
