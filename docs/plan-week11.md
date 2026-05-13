# 11주차 계획 — 기획·설계 + 프로토타입

> 과목: "AI를 활용한 실무 front-end 개발(2026)"
> 미션: 스마트블로그 서비스 (GitHub 활동 → LLM → 개발 블로그 자동 생성)
> 기간: 2026-05-13 (수) ~ 2026-05-17 (일)
> 가이드: [`week11_12_guide.pdf`](../../week11_12_guide.pdf) — 11주차는 "기획구체화, 설계 위주"

---

## 목표

1. 2주짜리 과제의 **기획·설계 산출물**을 완성한다.
2. 동작 가능한 **최소 프로토타입**을 통해 12주차 개발에 진입할 준비를 끝낸다.
   - 검증 가능한 한 가지 플로우: `GET /api/repos` → 사용자 GitHub repository 목록 → React 카드 표시
3. AI 활용 workflow 및 본인만의 Claude Skill (`feature-scaffold`) 1개를 정의·문서화한다.

## 산출물

| 분류 | 파일 | 비고 |
|---|---|---|
| 주차 계획 | `docs/plan-week11.md`, `docs/plan-week12.md` | PDF 요구: "주차별 계획을 md 파일로 적고 commit에 포함" |
| 요구·범위 | `docs/requirements.md`, `docs/user-flow.md`, `docs/scope.md` | |
| 설계 | `docs/tech-stack.md`, `docs/data-model.md`, `docs/architecture.md`, `docs/state-flow.md`, `docs/api-spec.md` | |
| AI 활용 | `docs/ai-workflow.md`, `.claude/skills/feature-scaffold/SKILL.md` | PDF 요구: "나만의 Skill을 하나 만들어서 사용" |
| 검증 | `docs/test-plan.md` | |
| 프로젝트 가이드 | `CLAUDE.md`, `docs/checklist.md`, `README.md` | PR 템플릿이 commit 요구 |
| 프로토타입 | `apps/client/` (Vite+React+TS+Tailwind), `apps/server/` (Express+TS+Octokit) | 모노레포 |
| 보안 베이스라인 | `.gitignore`, `.env.example` | 토큰 외부 노출 금지 |

## 일정 (5일)

- **Day 1 — 기획 구체화**
  - 보안 베이스라인 (`.gitignore`, `.env.example`)
  - `plan-week11`, `plan-week12`, `requirements`, `user-flow`, `scope`
- **Day 2 — 설계**
  - `tech-stack`, `data-model`, `architecture`, `state-flow`, `api-spec`
- **Day 3 — 프로토타입**
  - `apps/server/` 초기화 + Octokit GraphQL + `GET /api/repos`
  - `apps/client/` 초기화 + 저장소 카드 목록 페이지
  - 두 앱이 동시에 실행되고 카드 목록이 화면에 뜨는 것까지 확인
- **Day 4 — AI Workflow + Skill**
  - `.claude/skills/feature-scaffold/SKILL.md`
  - `docs/ai-workflow.md`, `docs/test-plan.md`
- **Day 5 — 마감 정리**
  - `CLAUDE.md`, `docs/checklist.md`, `README.md`
  - `feature/week11` 브랜치 push, **Draft PR** 작성 (자동 머지 워크플로우에 휩쓸리지 않도록)

## 완료 조건 (Definition of Done)

- 위 산출물이 모두 `feature/week11` 브랜치에 commit 되어 있다.
- `apps/server` 실행 시 `GET /api/repos`가 사용자의 GitHub repo 목록 JSON을 반환한다.
- `apps/client` 실행 시 위 응답을 카드 형태로 렌더링한다.
- 12주차 진입 시점에 "다음에 무엇을 만들지"가 `docs/plan-week12.md` 한 장으로 명확하다.

## 리스크 / 가정

- `auto-merge.yml`이 일요일 09:10 KST에 OPEN PR을 머지함 → 1차 PR은 **Draft** 상태로 유지.
- 11주차 동안 OpenAI API는 실제 호출하지 않음 (12주차 영역). 인터페이스만 정의.
- `GITHUB_TOKEN`, `OPENAI_API_KEY`는 `.env`로만 관리, commit 금지.
