# Commit to Blog

GitHub 활동 데이터를 분석해 자동으로 개발 블로그 초안을 생성하는 서비스입니다.  
React + Express + SQLite 기반으로 구성했고, GitHub API 와 OpenAI API 를 실제로 연결할 수 있으며 토큰이 없을 때는 데모 모드로 전체 흐름을 검증할 수 있습니다.

## 핵심 기능
- GitHub 저장소 목록 조회
- 브랜치 선택과 커밋 다중 선택
- 선택한 커밋 diff 기반 AI 블로그 초안 생성
- 마크다운 편집과 미리보기
- 저장된 포스트 카드 목록 조회
- 수정 및 발행 상태 관리

## 기술 선택
- Frontend: React + TypeScript + Vite
- Backend: Express + TypeScript
- Storage: SQLite (`better-sqlite3`)
- External APIs: GitHub REST API, OpenAI API

2주 범위의 과제에서 빠르게 MVP 를 만들고 타입 안정성과 로컬 실행 편의성을 같이 가져가기 위해 이 조합을 선택했습니다.

## 실행 방법
1. 의존성 설치
```bash
npm install
```

2. 환경 변수 파일 생성
```bash
cp .env.example .env
```

3. 필요 시 `.env` 값 채우기
```bash
PORT=4000
APP_ORIGIN=http://localhost:5173
DB_PATH=data/commit-to-blog.db
GITHUB_TOKEN=your_github_token
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-4.1-mini
DEMO_MODE=false
```

4. 개발 서버 실행
```bash
npm run dev
```

- Web: `http://localhost:5173`
- API: `http://localhost:4000`

## 데모 모드
아래 중 하나면 자동으로 데모 모드가 동작합니다.
- `GITHUB_TOKEN` 이 비어 있음
- `OPENAI_API_KEY` 가 비어 있음
- `DEMO_MODE=true`

데모 모드에서는 예시 저장소, 브랜치, 커밋 데이터를 사용하고 로컬 초안 생성기로 글을 만듭니다. 덕분에 API 키 없이도 전체 사용자 흐름을 확인할 수 있습니다.

## 검증 명령어
```bash
npm run check
npm run build
```

## 문서
- [1주차 계획](/Users/donghyun/Documents/commit-to-blog/docs/week-1-plan.md)
- [2주차 계획](/Users/donghyun/Documents/commit-to-blog/docs/week-2-plan.md)
- [아키텍처 문서](/Users/donghyun/Documents/commit-to-blog/docs/architecture.md)
- [AI Workflow](/Users/donghyun/Documents/commit-to-blog/docs/ai-workflow.md)
- [개발 체크리스트](/Users/donghyun/Documents/commit-to-blog/docs/checklist.md)

## 커스텀 Skill
- [commit-to-blog-loop](/Users/donghyun/Documents/commit-to-blog/skills/commit-to-blog-loop/SKILL.md)

이 Skill 은 요구사항을 수직 슬라이스로 자르고, API/저장 구조를 먼저 정의하고, 외부 연동이 없는 데모 폴백을 강제하는 규칙으로 이번 구현과 문서화에 사용했습니다.
