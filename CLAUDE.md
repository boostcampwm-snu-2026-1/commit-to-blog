# CLAUDE.md

이 파일은 Claude Code (또는 다른 AI 에이전트) 가 이 저장소에서 작업할 때 따라야 할 규칙을 모은다.
사용자(jj1kim) 의 학교 과제 컨텍스트를 반영하므로, 표준 가이드와 다른 점이 있다.

---

## 프로젝트 한 줄 요약

GitHub 활동을 LLM 으로 분석해 개발 블로그 초안을 자동 생성하는 서비스 (서울대 "AI를 활용한 실무 front-end 개발(2026)" 11–12주차 과제).
설계·구현 방침은 [`docs/plan-week11.md`](docs/plan-week11.md) 와 [`docs/plan-week12.md`](docs/plan-week12.md) 가 진실의 원천이다.

## 기술 스택 한 줄

- 모노레포(npm workspaces): `apps/client`(Vite+React+TS+Tailwind) / `apps/server`(Express+TS+Octokit+OpenAI SDK) / `packages/shared`(타입).
- 자세한 근거는 [`docs/tech-stack.md`](docs/tech-stack.md).

## 작업 시작 전 반드시 읽을 문서

1. [`docs/scope.md`](docs/scope.md) — 무엇을 만들고 무엇을 안 만들지.
2. [`docs/architecture.md`](docs/architecture.md) — 파일이 어디 들어가야 하는지.
3. [`docs/api-spec.md`](docs/api-spec.md) — 응답 포맷 (에러 envelope 포함).
4. [`docs/checklist.md`](docs/checklist.md) — 작업 단계별 체크리스트.

---

## Commit 규칙 (★ 가장 중요)

- **`Co-Authored-By: Claude …` 라인을 절대 추가하지 않는다.** AI co-author 흔적 없이, 사용자(`jj1kim <jeewonbob@gmail.com>`) 단독 author 로 커밋한다.
- "🤖 Generated with Claude Code" 푸터 등 어떤 형태의 AI 흔적도 commit message / PR body 에 자동 추가 금지.
- 의미 있는 작업 단위(문서 한 편, 라우트 한 도메인, feature 한 묶음)가 끝나면 **사용자에게 묻지 않고** 즉시 `git add … && git commit -m "…"` 실행.
- commit message 톤: "Add …", "Update …", "Fix …" 같은 명령형 한 문장 + 필요 시 본문에 변경 사항 bullet.

이유: 학교 과제이며 본인이 작성한 커밋으로 평가됨. AI 가 만든 커밋이 평가에 부정적이지 않더라도, 사용자가 작업 이력의 주체여야 함.

## 브랜치 / PR 규칙

- main 에 직접 commit 하지 않는다. 항상 `feature/<scope>` 브랜치 (예: `feature/week11`, `feature/week12-llm`).
- PR 은 미완료 동안 **Draft** 상태로 유지. `.github/workflows/auto-merge.yml` 이 매주 일요일 09:10 KST 에 OPEN PR 을 일괄 머지하므로, ready 상태로 두면 안 됨.
- PR 제목: `[전기정보공학부_김지원] - <한 문장 요약>` (PR 템플릿 규칙).
- PR 본문은 `.github/pull_request_template.md` 의 4섹션을 채운다.

## 시크릿 / 토큰

- `GITHUB_TOKEN`, `OPENAI_API_KEY` 는 `.env` 파일에만 존재. `.env` 는 `.gitignore` 에 등록되어 있음.
- 어떤 경우에도 토큰을 코드 안에 hardcode 하거나, log 출력하거나, commit 본문에 노출하지 않는다.
- `.env.example` 만 commit 대상.

## 코드 규칙

- 모든 시간 필드는 UTC ISO 8601 문자열. 표시 변환은 클라이언트에서 (`apps/client/src/lib/formatDate.ts`).
- 서버 응답은 항상 wrapper 객체 (`{ repos: [...] }`). 배열 최상위 응답 금지.
- 에러는 `apps/server/src/lib/ApiError.ts` 의 헬퍼로만 만든다. `next(new Error(...))` 사용 금지.
- 클라이언트는 외부 토큰을 절대 다루지 않는다. 모든 외부 API 는 Express 서버 경유.
- 새 sha 필드는 `sha`(40자) + `shortSha`(7자) 쌍으로.

## 디렉토리·파일 규칙

- React `features/<domain>/`: 도메인별 UI + hook. hook 파일은 `useXxx.ts`, 컴포넌트는 `PascalCase.tsx`.
- Express `services/<group>/`: 외부 API 통신 + 도메인 로직. mock fallback 은 같은 폴더 `mockData.ts`.
- shared 타입을 추가하면 반드시 `packages/shared/src/index.ts` 에 `export * from` 추가.
- Express 라우터를 추가하면 반드시 `apps/server/src/app.ts` 에 `app.use()` 등록.

## Skill 활용

- 새 도메인을 추가할 때는 [`.claude/skills/feature-scaffold/SKILL.md`](.claude/skills/feature-scaffold/SKILL.md) 의 체크리스트를 따른다.
- Skill 을 사용한 뒤 발견한 패턴/문제는 [`docs/ai-workflow.md`](docs/ai-workflow.md) 의 "Skill 개선 노트" 섹션에 추가하고, Skill 본체도 함께 갱신한다.

## 검증 명령

```bash
# 타입체크 (모든 workspace)
npm run typecheck

# 서버 / 클라이언트 동시 실행
npm run dev

# 개별 실행
npm run dev:server     # http://localhost:4000
npm run dev:client     # http://localhost:5173 (Vite proxy 로 /api → 4000)

# 클라이언트 production 빌드
npm run build -w apps/client
```

기본 스모크 테스트는 [`docs/test-plan.md`](docs/test-plan.md) 의 TC-1 ~ TC-7 을 참고.

## 작업 후 회고 항목

작업이 끝나면 다음을 갱신해두면 다음 사람(또는 다음 세션의 AI)이 빠르게 따라잡는다:

- [`docs/plan-week11.md`](docs/plan-week11.md) / [`docs/plan-week12.md`](docs/plan-week12.md) 의 완료 체크박스
- [`docs/ai-workflow.md`](docs/ai-workflow.md) 의 "Skill 개선 노트"
- 새로 발견한 결정 사항은 [`docs/architecture.md`](docs/architecture.md) 의 "결정 로그"
