# Skill: `commit-to-draft` v0

> 미션 요구 "Agent 개발에서 필요한 나만의 Skill을 하나 만들어서 사용한다"의 산출물.
> 본 문서는 Skill의 계약(Contract)을 정의하고, 구현·검증의 단일 진실 공급원(SSOT) 역할을 한다.

## 1. 목적

GitHub 커밋 1개 이상의 메시지 · 본문 · 변경 파일 목록 · diff 일부를
입력받아, **일관된 포맷의 한국어 블로그 초안 JSON**을 반환한다.

이 Skill은 두 환경에서 사용된다:
- **런타임**: `apps/server/src/services/llm.service.ts` 에서 OpenAI 호출 시.
- **개발 보조**: Claude/Cursor와 협업할 때, 본 문서를 그대로 컨텍스트로 붙여 동일한 출력 계약을 강제.

## 2. 입력 계약

```ts
type Input = {
  repo: string;                // "owner/name"
  branch: string;
  commits: Array<{
    sha: string;               // full sha
    message: string;           // 첫 줄
    body?: string;             // 본문 (선택)
    stats: { additions: number; deletions: number; total: number };
    files: Array<{
      filename: string;
      status: "added" | "modified" | "removed" | "renamed";
      additions: number;
      deletions: number;
      patch?: string;          // diff (서버에서 4000자로 슬라이스)
    }>;
  }>;
  style?: "default" | "short" | "technical" | "casual";
};
```

호출 측 책임:
- `patch`는 토큰 비용 통제를 위해 **호출 전에 잘라둘 것** (현재 4000자/파일).
- `commits.length`는 1~10 사이 (서버 검증).

## 3. 출력 계약

```ts
type Output = {
  title: string;     // 한국어, ≤ 40자, 마침표/이모지 금지
  excerpt: string;   // 한국어, ≤ 120자
  contentMd: string; // 한국어 마크다운 본문
};
```

- 응답은 **JSON 한 덩어리만**. 그 외 텍스트/설명/코드펜스 금지.
- OpenAI `response_format: { type: "json_object" }` 로 강제하고, 서버에서 zod로 한 번 더 검증한다.

### `contentMd` 섹션 구조 (필수, 이 순서)

1. `## 배경` — 왜 이 변경이 필요했는가 (1~3문장)
2. `## 변경 사항` — 무엇이 바뀌었는가 (불릿/단락, 핵심 파일·모듈 언급)
3. `## 영향과 주의` — 호환성·성능·주의점 (1~3문장)
4. `## 다음 단계` — 후속 작업/미해결 항목 (1~3문장, 없으면 "현재로서는 없음")

## 4. 작성 원칙

- **추측 금지**: 입력에 없는 사실(성능 수치, 외부 도구 도입 이유 등)을 만들지 말 것.
- **코드 인용 짧게**: 백틱 블록 1개당 10줄 이내.
- **자기지시 금지**: "이 커밋은", "위 변경은" 같은 메타 표현보다 변경의 의미를 직접 서술.
- **독자 가정**: 같은 저장소의 동료 개발자.

## 5. 스타일 변형

| `style` | 적용되는 추가 지시 |
|---|---|
| `default` | (추가 지시 없음) |
| `short` | 전체 길이 30% 축소 |
| `technical` | 기술 용어/코드 인용 비중 ↑ |
| `casual` | 가볍고 친근한 톤 |

## 6. 검증 (Definition of Done — v0)

본 Skill의 결과물은 다음을 모두 만족해야 한다:

- [ ] 응답이 `responseSchema` 통과 (zod, `apps/server/src/services/llm.service.ts`)
- [ ] `title` ≤ 40자, `excerpt` ≤ 120자
- [ ] `contentMd`가 4개 섹션을 **이 순서대로** 포함 (정규식 점검 가능)
- [ ] `apps/server/test/fixtures/commits/*.json` 5개에 대한 스냅샷이 사람이 검토하여 통과로 표시됨

## 7. 회귀 검증 워크플로

1. 새 케이스를 발견 → `apps/server/test/fixtures/commits/<slug>.json` 추가
2. `pnpm test:prompt` (2주차에 추가 예정) → 모든 fixture에 대해 LLM 호출 → 결과를 `__snapshots__/<slug>.md`에 저장
3. snapshot diff를 사람이 검토 → 의도된 변화면 커밋, 회귀면 프롬프트 수정

## 8. 변경 이력

- **v0 (week 1)** — 초안. 시스템 프롬프트는 [`apps/server/src/prompts/system.ts`](../../apps/server/src/prompts/system.ts), 사용자 프롬프트 빌더는 [`apps/server/src/prompts/buildUserPrompt.ts`](../../apps/server/src/prompts/buildUserPrompt.ts).
- v1 (week 2 예정) — 멀티 커밋 합치기 규칙 명시화, 스타일 프리셋 점검, 코드 인용 규칙 강화.
