# ADR 001: 기술 스택 선택

## 날짜
2026-05-17

## 상태
결정됨

## 배경
GitHub 레포를 참조하며 AI 에이전트와 대화로 블로그 포스트를 작성하는 서비스.
프론트엔드, 백엔드, AI 에이전트, DB, 인프라 스택을 결정해야 한다.

## 결정

| 영역 | 선택 |
|------|------|
| Frontend | React + Vite |
| Backend | FastAPI + LangGraph (단일 서비스) |
| DB | PostgreSQL |
| AI | OpenAI |
| 레포 저장 | Docker 볼륨 (git clone 후 유지) |
| 인프라 | Docker + Docker Compose |
| GitHub 데이터 조회 | GitHub GraphQL API |

## 주요 결정 이유

### FastAPI + LangGraph 통합 (단일 서비스)
둘 다 Python 기반이라 별도 컨테이너로 분리하면 불필요한 HTTP 통신이 생긴다.
이 프로젝트 규모에서는 통합이 더 단순하고 유지보수하기 쉽다.

### RAG 대신 파일시스템 탐색 에이전트
레포 전체를 벡터화하는 RAG 대신, 에이전트가 클론된 레포를 직접 탐색한다.
- pgvector, 임베딩 파이프라인 불필요 → 구현 복잡도 감소
- 에이전트 도구: `list_directory`, `read_file`, `search_in_repo`
- 레포 선택 UI는 GitHub GraphQL API로 제목 + README만 조회

### PostgreSQL (pgvector 없음)
RAG를 쓰지 않으므로 벡터 검색 불필요. 일반 PostgreSQL로 충분.
포스트, 유저, 레포 참조 데이터를 관계형으로 관리한다.

### 레포 클론 유지 (Docker 볼륨)
에이전트가 대화 중에 반복적으로 파일을 탐색하므로 클론 파일을 유지한다.
매 요청마다 클론하는 것보다 효율적이다.

## 고려했던 대안

### PostgreSQL + pgvector (RAG)
벡터 검색으로 관련 코드를 찾는 방식.
구현 복잡도가 높고, 에이전트 탐색 방식이 더 유연하다고 판단해 제외.

### Express (Node.js) 백엔드
프론트와 같은 언어(JS)를 쓰는 장점이 있으나,
LangGraph가 Python 전용이라 FastAPI로 통일하는 게 더 낫다고 판단.
