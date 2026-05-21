# AI Workflow — commit-to-blog 2주 회고

이 문서는 2주 동안 Claude Code를 어떤 식으로 활용했는지, 그리고 그 과정에서 굳어진 작업 패턴을 기록한 것이다. 마케팅용 글이 아니라 다음 학기/다음 프로젝트의 내 자신을 위한 회고에 가깝다.

---

## 1. 큰 그림

| 구분 | 1주차 (2026-05-17) | 2주차 (2026-05-21) |
|---|---|---|
| 산출물 | 스캐폴드 / GitHub API / posts CRUD / UI 골격 | LLM 어댑터 / `/api/draft` / 에디터 / Saved Posts 카드화 / 에러 UX / Gemini 실호출 |
| 커밋 수 | 6 | 6 |
| 핵심 의사결정 | 스택 확정 (Vite+React, Express, JSON 파일, PAT) | mock-first 전략, 디자인 vs spec 차이 조정, LLM 제공자 (Gemini) |

학습 목표(LLM 연동, AI workflow 자체 설계, 자체 Skill 추출)의 실질적 진척은 2주차에 몰렸다. 1주차는 그 토대를 까는 데 거의 다 썼고, 이는 의도된 분배였다.

---

## 2. 굳어진 작업 패턴

### 2.1 섹션 단위 반복 — Plan → 구현 → 검증 → 체크 → 커밋

`docs/week-2.md`의 A부터 E까지 다섯 섹션이 정확히 같은 모양으로 반복됐다:

1. "이제 X 해줘" — 사용자가 섹션 지목
2. Claude가 TodoWrite로 3~6개 단위로 분해, 첫 단위를 in_progress
3. 구현
4. curl 또는 node로 e2e 시뮬레이션 검증
5. `week-2.md`에서 해당 섹션 체크박스 `[x]` 업데이트
6. 커밋 (기존 git log 스타일 따라 짧은 imperative)
7. 다음 섹션 진행 여부를 사용자에게 확인

이 패턴이 충분히 정착돼서 별도 Skill로 추출했다 — `.claude/skills/checklist-section-iterate/SKILL.md`. (project-level이므로 git에는 안 올라가지만 절차는 다음 절에 요약.)

### 2.2 mock-first 어댑터 전략

LLM 호출 부분을 처음부터 실 API에 묶지 않고, `LLM_PROVIDER` env로 분기되는 어댑터 + mock 구현체부터 만들었다.

```
generateDraft({ commits })  →  { title, content, summary }
PROVIDERS = { mock, gemini, anthropic, openai }
```

효과:

- **A→B→C→D→E 다섯 섹션이 모두 mock 위에서 굴러갔다.** UI 흐름, 에디터, 저장, 카드, 에러 배너까지 LLM 키 없이 완성.
- **마지막에 Gemini 통합이 함수 하나 추가 + env 한 줄 변경**으로 끝났다. `buildPrompt`는 mock이든 real이든 그대로 쓰임.
- 만약 처음부터 Gemini에 묶었다면 키 발급/모델 선택/응답 파싱 결정이 1주차 끝에 모두 몰렸을 것.

### 2.3 검증 사다리

UI를 직접 못 보는 환경(Claude Code)이라 검증은 항상 **가장 낮은 레벨에서 끝내고**, 브라우저는 마지막 보증으로만 사용했다.

| 레벨 | 도구 | 사용 예 |
|---|---|---|
| 모듈 | `node -e "import('./llm.js').then(...)"` | mock 어댑터, prompt builder |
| HTTP | `curl ... \| python3 -m json.tool` | 각 라우트 happy path + 에러 경로 |
| E2E | node fetch chain | draft → save → toggle → delete (D 검증) |
| 브라우저 | 사용자에게 체크포인트 리스트 위임 | UI 변경 확인 |

매트릭스 검증의 표준 형태: **happy path 1 + 입력 검증 에러 2~3 + 외부 의존성 에러 1**. B에서 5가지, D에서 5가지 경로를 이 형태로 돌렸다.

### 2.4 의사결정은 코드 전에 — AskUserQuestion

큰 갈림길에서는 항상 4지선다로 좁혀서 사용자에게 물었다. 이번 2주에 사용된 분기:

- 단일 커밋 vs 멀티 커밋 (week-2 spec 시작 시)
- 에디터 형태 — react-markdown 미리보기 vs 단일 textarea (screenshot 일치)
- Settings/푸터/썸네일 포함 여부 (UI 부가 요소)
- LLM 제공자 — mock만 vs Gemini vs Anthropic vs OpenAI (2회)
- Skill 주제 — 4개 후보 중 1개

각 갈림길에서 한 번 결정하면 그 가정 위에 코드가 누적되니까, "그냥 짜고 보자"가 아니라 5분 늦더라도 사용자에게 묻는 게 누적 이득이 컸다.

---

## 3. Companion Skill

추출한 Skill: **`checklist-section-iterate`** — 주차별 plan md의 한 섹션을 끝까지 미는 5단 절차.

위치: `.claude/skills/checklist-section-iterate/SKILL.md` (project-local, gitignored)

5단 요약:

1. **읽기** — 섹션의 `[ ]` 목록 파악, 이미 `[x]`인 것 확인, 의존성 확인
2. **분해** — TodoWrite로 3~6개 in-progress 단위, 검증·체크오프·커밋도 별도 todo로 포함
3. **구현** — 기존 파일 스타일 따라가기, 새 추상화 도입 자제
4. **검증** — 가장 낮은 레벨부터 (모듈→HTTP→E2E→브라우저). 매트릭스는 happy 1 + 검증 에러 2~3 + 외부 에러 1
5. **체크 + 커밋** — md 파일 `[x]` 업데이트, 커밋 메시지는 기존 git log 스타일

자세한 anti-patterns는 SKILL.md 본문 참고.

> 이 Skill을 git에 올리려면 `.gitignore`에 `!.claude/skills/` 예외를 추가하거나 `~/.claude/skills/` (user-level)로 옮기면 된다. 현재 buildup은 의도적으로 로컬에만 둠.

---

## 4. 1주차 → 2주차 워크플로 개선점

1주차 작업 흔적을 git log + memory에서 역추적해본 결과 (1주차 직접 기록은 남기지 않았음):

### 나아진 것

- **mock-first 채택**: 1주차에선 GitHub API 라우트 4개를 직접 호출하며 만들었다 — PAT 발급/scope 문제가 그 단계에서 곧바로 부딪혔다. 2주차에서는 LLM 호출을 mock 뒤로 미뤄서 UI 작업이 키 발급에 막히지 않았음.
- **섹션 단위 commit**: 1주차 commit 6개도 깔끔하지만, 2주차는 plan md의 섹션과 commit이 1:1 대응. 회고가 훨씬 쉬워짐.
- **AskUserQuestion 적극 사용**: 1주차 시작 시 스택을 한 번에 큰 표로 확정한 것과 같은 방식을, 2주차에는 작은 갈림길마다 반복함. 디자인 vs spec 차이를 코딩 전에 5분 만에 해소.
- **검증 사다리 정착**: 2주차에선 매 섹션 끝에 curl/node 매트릭스 — 1주차에서는 검증 정형화가 덜 됐던 것으로 보임 (1주차 메모는 happy path만 확인했다는 식의 짧은 메모만 있음).

### 아직 부족한 것

- **브라우저 검증 자동화 부재**: Claude는 브라우저를 직접 못 봐서 매번 사용자에게 체크포인트 리스트를 던지고 손으로 검증을 요청해야 했다. F의 시나리오 3개를 본격적으로 돌릴 때 이 한계가 커진다.
- **테스트 코드 부재**: 검증은 일회성 curl/node script로만 했고, 회귀 보장은 없음. 학습 범위에서 일부러 뺐지만, 다음 프로젝트에선 최소한의 vitest 정도는 넣고 싶다.
- **commit 메시지의 학습 가치 부족**: 메시지는 깔끔하지만 "why"가 빠져있다. 회고 시 git log만 보면 동기를 모름. 다음 번엔 body에 한 줄짜리 의도라도 적기.

---

## 5. 정리

이번 2주의 진짜 산출물은 동작하는 commit-to-blog 앱이 아니라, **위 1~4에서 추출된 워크플로 그 자체**다. 같은 패턴으로 다음 프로젝트를 시작할 수 있게 됐다는 점이 핵심 학습 결과.
