# 스펙 — Smart Blog (commit-to-blog)

## 목적
GitHub 커밋 활동을 LLM으로 분석해 개발 블로그 초안을 자동 생성하고, 사용자가 편집·저장·발행할 수 있는 웹 서비스.

## 핵심 기능

### 1. 블로그 생성 (Create Blog)
- 사용자의 GitHub repository 목록 조회 후 하나 선택
- 분석할 브랜치 선택, 해당 브랜치의 커밋들을 다중 선택
- 선택된 커밋의 메시지와 diff를 LLM에 보내 블로그 초안 markdown 생성
- 생성된 초안을 편집기에서 수정
- 초안을 포스트로 저장 (기본 상태: draft)

### 2. 저장된 포스트 (Saved Posts)
- 저장된 글들을 카드 그리드로 표시 (브랜치 태그, 미리보기, 날짜)
- 수정하기: 편집기로 진입해 내용 수정 후 다시 저장
- 발행하기: 포스트 상태를 `draft` → `published`로 변경 (외부 플랫폼 publishing은 범위 외)

## 아키텍처
```
Browser → React Client → Express Server → GitHub API
                                        → LLM API
```
- React Client: 상태 관리, 서버 API 호출, UI
- Express Server: 라우팅, GitHub/LLM API 프록시
- GitHub/LLM API 호출은 Express 서버에서만 수행 (토큰이 클라이언트에 노출되지 않음)

## 제약
- GitHub / LLM API 토큰은 `.env`로 관리하며 git에 commit되지 않는다
- GitHub API 호출은 반드시 Express 서버에서 수행한다

## 학습 목표
- 기획·요구사항 분석을 통한 개발 항목 정리
- AI 활용 workflow 수립
- LLM 연동 AI 서비스 구현
- 프로젝트 진행 중 발견한 패턴을 Skill 1개로 정립
