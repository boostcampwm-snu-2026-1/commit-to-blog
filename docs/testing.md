# 테스트 전략

## 도구

| 목적 | 도구 |
|---|---|
| 단위 테스트 | Vitest + React Testing Library |
| E2E 테스트 | Playwright |

통합 테스트는 작성하지 않는다. API는 E2E가 간접적으로 커버한다.

## 단위 테스트 대상

- `src/hooks/useWizardState.ts` — reducer 상태 전이
- `src/lib/gemini.ts` — AI 응답에서 제목 파싱 로직
- `src/lib/github.ts` — diff truncation 로직

## E2E 테스트 대상

- 위저드 전체 흐름 (PAT 입력 → 저장 완료)
- 포스트 발행 / 초안 토글
