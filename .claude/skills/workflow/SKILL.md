---
name: workflow
description: 사용자가 /workflow를 입력하면 프로젝트 루트의 checklist.md에서 첫 번째 미완료 항목을 찾아 설계 → 구현 → 리뷰 → 확인 → commit 준비까지의 전체 개발 워크플로우를 단계별로 진행합니다. 사용자가 "/workflow"를 입력하면 반드시 이 스킬을 사용하세요.
---

## 진입점

`/workflow`가 입력되면 아래 순서로 단계 파일을 읽고 실행한다.

1. `stages/design.md` 를 읽고 설계 단계를 진행한다
2. 설계가 완료되면 `stages/implement.md` 를 읽고 구현 단계를 진행한다
3. 구현이 완료되면 `stages/review.md` 를 읽고 리뷰 단계를 진행한다
4. 리뷰/확인 루프는 `stages/review.md` ↔ `stages/confirm.md` 사이에서 반복된다
5. 사용자가 최종 확인을 마치면 `stages/commit.md` 를 읽고 커밋 준비 단계를 진행한다

각 단계는 완료 조건이 충족되면 별도 안내 없이 자동으로 다음 단계로 넘어간다.
