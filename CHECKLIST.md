# 1주차 체크리스트

> [docs/week1-plan.md](docs/week1-plan.md) 기반. 월~목 작업은 플랜 문서 작성으로 완료, 금요일 "문서 정리 + 보일러플레이트"가 남은 실행 항목.

## 문서 정리
- [x] `week1_plan.md` → `docs/week1-plan.md`로 이동
- [x] `.gitignore` 작성 (`node_modules`, `.env`, `server/data/posts.json`, `dist`)
- [x] `.env.example` 작성 (`GITHUB_TOKEN`, `OPENAI_API_KEY`, `PORT`)
- [x] `README.md` — 한 줄 소개 + 디렉토리/실행법 스텁
- [x] `CLAUDE.md` 작성

## 보일러플레이트 (뼈대만, 로직 X)
- [x] `client/` 폴더 + `package.json` + `src/App.jsx`, `src/main.jsx`
- [x] `server/` 폴더 + `package.json` + `src/index.js`(`/api/health`만)
- [x] `server/src/{routes,services,middleware}/.gitkeep`
- [x] `server/data/posts.json` → `[]`
- [x] 루트 `package.json` (concurrently로 client+server 동시 실행)

## 다음 단계 (사용자가 직접)
- [ ] `npm install` (루트, client, server)
- [ ] Vite + React + Tailwind 실제 셋업 (`npm create vite@latest client -- --template react` 후 머지하거나 수동)
- [ ] `npm run dev` 동작 확인 → 클라 5173, 서버 4000
- [ ] `curl http://localhost:4000/api/health` 200 확인
- [ ] `.env` 생성 후 `git status`에 안 잡히는지 확인

## Skill 계획

플랜 §10의 후보(GitHub 응답 매핑 / 블로그 프롬프트 템플릿)는 **코드 작성 후** 패턴이 보일 때 만든다. 1주차엔 만들지 않음 — 추측 기반이 됨.

### 1주차에 만들 후보 (워크플로우용)
| Skill | trigger | 1주차 효용 |
|---|---|---|
| `commit-summary` | "이번 작업 요약/회고/블로그 초안" | §10 프롬프트 템플릿을 dogfooding으로 다듬음 → 2주차 `services/openai.js` 초안이 됨 |
| `api-route-scaffold` | "새 라우트 추가" | §5 API 표대로 `routes/*.js` + service 호출 + error handler 생성 |
| `env-check` | 서버 시작 전 hook | `.env` 키 누락 시 명확한 에러 (§9 검증 기준과 연결) |

**우선순위**: `commit-summary` 1순위 (프롬프트 템플릿이 프로젝트 핵심 자산). 나머지는 2주차 코드 생기면 만든다.

### Skill 만드는 법 요약
1. `~/.claude/skills/<name>/SKILL.md` 생성
2. frontmatter에 `name`, `description`(언제 쓰고 언제 안 쓸지 구체적으로)
3. 본문에 단계별 지시 + 출력 포맷
4. 보조 파일(템플릿/스크립트)은 같은 폴더에 두고 본문에서 참조
