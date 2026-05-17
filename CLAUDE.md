# 스마트 블로그 (GitHub 연동)

> GitHub 레포를 선택적으로 참조하며 AI 에이전트와 대화로 블로그 포스트를 작성하는 서비스

## 스택
- Frontend: React
- Backend: Express + LangGraph + RAG
- AI: OpenAI
- API: GitHub API, GraphQL
- VectorDB: 미정
- 배포: 미정

## 주요 커맨드
```bash
# 전체 실행
docker-compose up

# 개발 서버 (개별)
docker-compose up frontend
docker-compose up backend

# DB 초기화
docker-compose exec db psql -U postgres -f /init.sql
```

---

## 작업 시스템

이 프로젝트는 KB + 4단계 스킬 워크플로우로 운영된다.

### 세션 시작
```
/orchestrator
```
현재 상태를 파악하고 협업 모드로 진입한다.

### 워크플로우
```
/whattodo-next  →  /planner  →  /executor  →  /evaluator
 task 선택           계획 수립      계획 실행       검증 + 완료
```

### 시스템 구조
| 디렉터리 | 역할 | 변경 빈도 |
|----------|------|-----------|
| `docs/`  | 도메인 지식 + 아키텍처 결정 | 낮음 |
| `rules/` | 코딩/디자인/협업 규칙 | 매우 낮음 |
| `progress/` | 현재 진행 상황 | 높음 |
| `.claude/skills/` | 워크플로우 스킬 | 낮음 |

### 핵심 파일
- KB 진입점: @docs/README.md
- 규칙 목록: @rules/README.md
- 현재 작업: @progress/current.md
- 현재 계획: @progress/plan.md

### 원칙
- 가정하지 말고 질문한다
- 사용자 확인 없이 단계를 넘어가지 않는다
- 모호한 것은 즉시 멈추고 보고한다
