# Commit Fixtures

`commit-to-draft` Skill의 회귀 검증용 입력 모음. 각 JSON은 `SummarizeRequest`
스키마를 그대로 따른다 (`apps/server/src/types/index.ts`).

| 파일 | 시나리오 | 스타일 | 특징 |
|---|---|---|---|
| `01-bugfix-auth-session.json` | 세션 만료/Redis 안정성 버그 픽스 | default | 작은 변경, 본문 자세함 |
| `02-refactor-auth-module.json` | 모놀리식 auth → 서비스/미들웨어 분리 | technical | 다중 파일, 삭제 포함 |
| `03-feature-api-race-fix.json` | 낙관적 업데이트 + 409 충돌 처리 | default | FE/BE 양쪽 변경 |
| `04-ci-optimize-pipeline.json` | GHA pnpm 캐시·잡 분리 | casual | 단일 파일, 코드 아닌 yaml |
| `05-docs-architecture.json` | 아키텍처 문서 갱신 | short | 코드 변경 없음, 마크다운 |

## 2주차 활용

```
pnpm test:prompt   # 모든 fixture에 대해 LLM 호출 → __snapshots__/<slug>.md 저장
```

- 첫 실행 시: 사람이 출력을 확인하고 통과 마킹.
- 이후 실행 시: 스냅샷 diff만 검토. 의도된 변경이면 갱신, 아니면 프롬프트/모델 재조정.
- 새 케이스가 필요해지면 같은 형식으로 `06-*.json` 추가.
