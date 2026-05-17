# Week 1 Plan

## Goal

1주차 목표는 미션 요구사항을 프로젝트 구조와 실행 가능한 MVP 범위로 바꾸는 것이다. 구현은 최소 흐름을 시작하되, 가장 중요한 산출물은 설계와 계획의 기준선을 남기는 것이다.

## Mission Summary

이 서비스는 GitHub Repository, Branch, Commit 데이터를 선택하고, 선택된 커밋 정보를 LLM으로 분석해 개발 블로그 초안을 만든다. 사용자는 생성된 초안을 편집하고 저장된 포스트 목록에서 다시 확인할 수 있어야 한다.

## MVP Scope For Week 1

- 문서 기준선 정리: `Mission.md`, `checklist.md`, 주차별 계획 문서
- 기술 스택 선택과 이유 정리
- React/Express 역할 분리 결정
- 주요 데이터 모델 초안 정의
- 화면 흐름 초안 정의: 저장소 선택 -> 브랜치 선택 -> 커밋 선택 -> 초안 생성 -> 편집/저장
- 서버 API 경계 초안 정의: GitHub API, LLM API, Posts API
- 프로젝트 전용 AI skills 정리

## Deferred To Week 2

- 실제 GitHub API 연동 구현
- 실제 LLM API 연동 구현
- 저장된 포스트 목록 UI 완성
- 포스트 수정/발행 상태 전환
- 에러, 로딩, 빈 상태의 세부 UI 완성
- 수동 검증 시나리오 실행과 결과 기록

## Deliverables

- `docs/week-1-plan.md`
- `docs/week-2-plan.md`
- `docs/tech-stack.md`
- `Mission.md`
- `checklist.md`
- `skills/`

## Verification

- `checklist.md`의 1번 항목이 모두 완료 상태인지 확인한다.
- 문서가 1주차와 2주차 범위를 명확히 나누는지 확인한다.
- MVP에 GitHub 선택, 커밋 선택, LLM 초안, 편집, 저장 흐름이 포함되어 있는지 확인한다.
- 토큰이나 API key 값이 문서에 직접 들어가지 않았는지 확인한다.
