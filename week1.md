# Week 1 — 기획 및 설계

## 프로젝트 주제

**스마트 블로그 (GitHub 연동)**

GitHub 레포를 선택적으로 참조하며, AI 에이전트와 대화를 통해 개발 블로그 포스트를 작성하는 서비스.

### 핵심 차별점

기존 LLM 요약 방식과 달리, 포스트 작성 화면 우측에 에이전트 챗 세션을 두고 **대화하면서 글을 써나가는 방식**을 채택했다. 에이전트는 사용자가 선택한 GitHub 레포의 파일시스템을 직접 탐색하며 맥락을 파악한다.

### 주요 기능

- GitHub 레포 목록 조회 및 선택 (GraphQL API)
- 레포 clone 후 에이전트가 파일 직접 탐색 (list_directory, read_file, search)
- 에이전트 챗 ↔ 마크다운 에디터 연동 (수정 제안 → 적용 버튼)
- 포스트에 레포/브랜치를 인라인 또는 태그 형태로 참조

---

## 아키텍처

### 기술 스택

| 영역 | 선택 | 이유 |
|------|------|------|
| Frontend | React + Vite | SPA, TypeScript 지원 |
| Backend | FastAPI + LangGraph | Python 통일, 단일 서비스로 통합 |
| DB | PostgreSQL | 관계형 데이터 관리 |
| AI | OpenAI | LLM 연동 |
| 인프라 | Docker + Docker Compose | 로컬 환경 일관성 |
| 레포 저장 | Docker 볼륨 (파일시스템) | 클론 유지, DB 불필요 |

### 서비스 구조

```
Frontend (React)
    ↓ REST API
Backend (FastAPI + LangGraph)
    ├── GitHub GraphQL API   레포 목록/README 조회
    ├── repos/ (볼륨)        클론된 레포 파일 탐색
    ├── OpenAI               에이전트 LLM
    └── PostgreSQL           포스트/유저/챗 데이터
```

### 핵심 설계 결정

- **RAG 미사용**: 벡터화 대신 에이전트가 파일시스템을 직접 탐색. 구현 복잡도를 낮추고 탐색 유연성을 높임.
- **FastAPI + LangGraph 단일 서비스**: Python으로 통일해 서비스 간 HTTP 통신 오버헤드 제거.
- **에이전트 수정 제안 → 적용 버튼**: 에이전트가 직접 에디터를 수정하지 않고, 사용자가 확인 후 반영.

### 데이터 모델 (핵심)

```
User → Repository (clone_path 보관)
User → Post (마크다운 content)
Post → PostRepoReference (레포/브랜치 참조)
Post → ChatSession → ChatMessage
ChatSession → ChatRepoContext (에이전트 참조 중인 레포)
```

---

## Claude 활용 방식

### 1. 개발 프로세스 레벨 — 에이전틱 워크플로우

이 프로젝트는 Claude Code를 단순 코드 생성 도구가 아닌 **개발 파트너**로 활용한다. 구체적으로는 아래 4단계 사이클로 운영된다.

```
/whattodo-next  →  /planner  →  /executor  →  /evaluator
  task 선택         계획 수립     계획 실행      검증 + 완료
```

각 단계는 `.claude/skills/` 에 정의된 커스텀 스킬로 구현됐으며, 핵심 원칙은 **Human-in-the-loop**: Claude가 각 단계에서 선택지와 이유를 제시하고, 사용자 승인 없이는 다음 단계로 넘어가지 않는다.

**지식 구조 (Knowledge Base)**

```
CLAUDE.md          진입점 (짧게 유지)
docs/              도메인 지식 (코드 구조 미러링)
  architecture/    데이터 모델, 디렉터리 구조
  frontend/        컴포넌트, 상태 흐름
  adr/             기술 의사결정 기록
rules/             협업/코딩/디자인 규칙 (선택적 로드)
progress/          세션 간 작업 상태 유지
```

이 구조 덕분에 Claude는 세션이 끊겨도 `progress/current.md`를 읽고 이전 맥락을 이어받는다.

### 2. 서비스 레벨 — 에이전트 기반 글쓰기

서비스 사용자 관점에서 Claude(LLM)는 **블로그 글쓰기 협업 에이전트**로 작동한다.

- 사용자가 GitHub 레포를 선택하면 에이전트는 해당 레포 파일시스템을 탐색 도구로 접근
- 대화를 통해 커밋 내용, 코드 변경 사항을 분석하고 블로그 초안을 제안
- LangGraph로 에이전트 상태 흐름을 관리하며, 필요 시 여러 도구를 순차 호출

### 이번 주 성과

| 항목 | 완료 여부 |
|------|----------|
| 프로젝트 주제 및 기능 확정 | ✅ |
| 기술 스택 결정 + ADR 작성 | ✅ |
| 데이터 모델 정의 | ✅ |
| 아키텍처 + 컴포넌트 + 상태 흐름 설계 | ✅ |
| Docker 개발 환경 구동 | ✅ |
| Claude 에이전틱 워크플로우 구축 | ✅ |
