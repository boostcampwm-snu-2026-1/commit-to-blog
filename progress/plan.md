# 현재 Plan

> /planner 가 작성하고, /executor 가 읽는다.

## 상태
진행 중

---

## Task
프로젝트 주제 결정 (메타 task)

## 문제 정의
스마트 블로그 서비스의 1주차 설계를 완성한다.
이후 개발 task들이 이 설계를 기반으로 진행되므로,
기술 스택부터 상태 흐름까지 구체적으로 확정해야 한다.

## 접근 방법
기술 스택 → 데이터 구조 → 아키텍처 → 컴포넌트 → 상태흐름 순으로 진행.
스택이 확정돼야 나머지 설계가 구체화되기 때문.

## 실행 단계
- [ ] 1. 기술 스택 최종 결정 + docs/adr/001-tech-stack.md 작성
- [ ] 2. 데이터 구조 정의 → docs/architecture/data-model.md
- [ ] 3. 아키텍처 설계 (디렉터리 구조) → docs/architecture/structure.md
- [ ] 4. 컴포넌트 구조 정의 → docs/frontend/components.md
- [ ] 5. 상태 흐름 정의 → docs/frontend/state-flow.md
- [ ] 6. CLAUDE.md 업데이트 + docs/ 구조 확정

## 예상 변경 파일
- docs/adr/001-tech-stack.md (신규)
- docs/architecture/data-model.md (신규)
- docs/architecture/structure.md (신규)
- docs/frontend/components.md (신규)
- docs/frontend/state-flow.md (신규)
- CLAUDE.md (업데이트)

## 리스크
- 벡터DB 미정 → 1단계에서 결정
