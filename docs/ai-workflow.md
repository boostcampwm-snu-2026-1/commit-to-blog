# AI Workflow

> "AI를 활용한 workflow 를 스스로 만들어서 계획을 수립할 수 있다." — PDF 학습 목표.
> 11~12주차 동안 어떻게 AI(=Claude Code)를 활용해 계획·설계·구현·검증을 굴려나갈지 정리한다.

---

## 1. 단계 (Plan → Design → Build → Verify → Reflect)

```
[Plan]   ──▶  요구·범위·일정    (docs/plan-*.md, requirements.md, scope.md)
   │
   ▼
[Design] ──▶  도구·구조·계약    (docs/tech-stack, data-model, architecture, state-flow, api-spec)
   │
   ▼
[Build]  ──▶  코드 작성         (apps/*, packages/*)
   │            │
   │            └─ 패턴 반복 시 → feature-scaffold Skill 호출
   ▼
[Verify] ──▶  타입체크/스모크/UI  (npm run typecheck, curl, 브라우저)
   │
   ▼
[Reflect] ──▶ 개선점 추출        (이 문서의 "Skill 개선 노트")
              └─ Skill / workflow / 문서 보완
```

각 단계마다 **AI에게 무엇을 시키고, 사람이 무엇을 결정하는지** 명확히 한다.

## 2. 단계별 AI 활용 패턴

### Plan
- **AI에게**: 흩어진 요구사항을 표/체크리스트로 정리. 우선순위 후보 제안.
- **사람**: 우선순위 결정. 범위 자르기 (Must/Should/Could/Won't).
- **산출물**: `docs/plan-weekN.md`, `docs/requirements.md`, `docs/scope.md`.

### Design
- **AI에게**: 폴더 구조 후보, 타입 초안, 엔드포인트 스펙 초안 작성.
- **사람**: 트레이드오프 결정 (모노레포 vs 평탄, REST vs GraphQL, in-memory vs DB).
- **산출물**: `docs/tech-stack.md`, `docs/data-model.md`, `docs/architecture.md`, `docs/state-flow.md`, `docs/api-spec.md`.

### Build
- **AI에게**: 정해진 패턴대로 파일 묶음 생성. `feature-scaffold` Skill 호출.
- **사람**: 도메인 이름, 응답 필드, 예외 케이스 정의.
- **산출물**: 작동하는 코드 + 의미 단위 commit.

### Verify
- **AI에게**: `npm run typecheck`, 서버 부팅 + `curl`, 빌드 실행.
- **사람**: 화면 눈으로 확인. 에러 경로 직접 클릭.
- **산출물**: 통과 로그, 스크린샷.

### Reflect
- **AI에게**: 이번 단계에서 자주 누락된 것, 헛친 명령 정리.
- **사람**: 어떤 패턴을 Skill 로 굳힐지, 어떤 문서를 업데이트할지 결정.
- **산출물**: Skill 보완, 문서 갱신.

## 3. 질문 패턴 (커지지 않게)

| 안 좋은 질문 | 좋은 질문 |
|---|---|
| "전체 만들어줘" | "지금은 `apps/server/src/routes/repos.ts` 의 `GET /api/repos` 만, 응답은 `{ repos: Repo[] }`" |
| "에러 처리 어떻게 해" | "Zod 검증 실패 시 400 + `BAD_REQUEST` 코드로 반환되도록, 미들웨어 한 곳에서" |
| "예쁘게 해줘" | "PDF 예시 화면의 카드 레이아웃처럼 — `gap-4`, 카드 안 avatar+title+desc+date" |
| "이거 왜 안 돼" | "이 명령 결과(붙여넣기)에서 발생한 `TS2304: Cannot find name` 의 원인" |

핵심: **AI에게 너무 크게 묻지 말고 잘게 쪼개서.** (PDF "다르게 한다면?" 예시 그대로)

## 4. 사용 중인 Claude Code 기능

- **Slash commands** (skill): 반복 패턴을 호출 가능한 단위로 굳힘.
  - `feature-scaffold` — 새 도메인 묶음 추가 (이번에 만든 Skill).
- **TodoWrite**: 5일치 일정을 한 번에 펼쳐 진행 상황 추적.
- **CLAUDE.md**: 프로젝트 규칙 (자동 커밋, co-author 미포함, 토큰 보호) 을 영구화.

## 5. 약속 / 운영 규칙

- **commit 단위**: 한 작업 = 한 commit. 의미 단위가 끝나면 즉시 add+commit.
- **commit author**: `jj1kim <jeewonbob@gmail.com>` 단독. AI co-author 라인 미포함.
- **branch**: `feature/weekN`. main 직접 commit 금지.
- **PR**: 미완료 시 **Draft** 로 유지 (자동 머지 워크플로우 회피).
- **시크릿**: `.env`만 사용. `.env.example` 외에 키 파일을 만들지 않음.

## 6. Skill 개선 노트

> 한 번 만든 Skill 은 사용하며 자란다. 다음 항목은 12주차에 채워나간다.

- (예시) `feature-scaffold` 사용 후 빠뜨린 파일: `apps/server/src/app.ts` 에 라우터 등록 누락.
  - 대응: Skill 의 "C. 서버 route" 체크박스에 "app.use() 등록 확인" 명시 (이미 반영됨).
- (예시) shared 타입 추가 후 `index.ts` re-export 누락.
  - 대응: Skill 의 "A. shared 타입" 체크박스에 명시 (이미 반영됨).

## 7. 12주차로 가져갈 것

- LLM 프롬프트 템플릿화 → `apps/server/src/services/llm/prompts/` 디렉토리.
- 같은 sha 입력 = 같은 응답 캐시 키 (`makeContextKey`).
- 에러 메시지 한국어/영어 톤 통일.
- 단위 테스트는 핵심 path (`listRepos`, `makeContextKey`, `errorHandler`) 부터 도입.
