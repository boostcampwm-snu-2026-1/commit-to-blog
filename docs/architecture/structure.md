# 아키텍처 설계 (디렉터리 구조)

## Docker Compose 서비스

| 서비스 | 기술 | 역할 |
|--------|------|------|
| frontend | React + Vite | UI |
| backend | FastAPI + LangGraph | API + AI 에이전트 |
| db | PostgreSQL | 데이터 저장 |

## 전체 디렉터리 구조

```
commit-to-blog/
├── docker-compose.yml
│
├── frontend/
│   ├── src/
│   │   ├── components/        공통 컴포넌트
│   │   ├── pages/             라우트 페이지
│   │   ├── hooks/             커스텀 훅
│   │   ├── services/          API 호출 (fetch)
│   │   ├── store/             전역 상태
│   │   ├── types/             TypeScript 타입 정의
│   │   └── utils/             유틸 함수
│   ├── public/
│   ├── Dockerfile
│   └── vite.config.ts
│
├── backend/
│   ├── app/
│   │   ├── api/               라우터
│   │   │   ├── posts.py       포스트 CRUD
│   │   │   ├── repos.py       레포 연동 (clone, list)
│   │   │   └── chat.py        챗 세션 + 스트리밍
│   │   ├── agent/             LangGraph 에이전트
│   │   │   ├── graph.py       그래프 정의
│   │   │   ├── tools/         에이전트 도구
│   │   │   │   ├── file_system.py   list_directory, read_file, search_in_repo
│   │   │   │   └── github.py        레포 목록, README 조회 (GraphQL)
│   │   │   └── prompts/       시스템 프롬프트
│   │   ├── models/            SQLAlchemy 모델
│   │   ├── schemas/           Pydantic 스키마
│   │   ├── services/          비즈니스 로직
│   │   ├── core/              설정, DB 연결
│   │   └── main.py
│   ├── repos/                 클론된 레포 저장 (Docker 볼륨 마운트)
│   ├── Dockerfile
│   └── requirements.txt
│
└── db/
    └── init.sql               테이블 초기화 스크립트
```

## 서비스 간 통신

```
Frontend  →  Backend (FastAPI)  →  PostgreSQL
                  ↓
            LangGraph Agent
                  ↓
         repos/ (클론된 파일시스템)
         GitHub GraphQL API
         OpenAI API
```

## 주요 설계 결정
- 레포 클론 파일은 `backend/repos/`에 보관하며 Docker 볼륨으로 유지
- LangGraph는 FastAPI 내부에 통합 (별도 서비스 없음)
- 챗 응답은 스트리밍으로 전달 (FastAPI StreamingResponse)
