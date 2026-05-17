# commit-to-blog

GitHub 커밋/코드 변경 이력을 AI가 분석해 자동으로 개발 블로그 초안을 생성하는 서비스.

## 프로젝트 시작

```bash
# 1. Next.js 초기화
npx create-next-app@14 . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

# 2. shadcn/ui 설정
npx shadcn@latest init
npx shadcn@latest add button card badge input label progress skeleton toast

# 3. 추가 의존성
npm install mongoose @google/generative-ai @uiw/react-md-editor date-fns

# 4. 환경 변수 설정
cp .env.example .env.local
# .env.local에 MONGODB_URI, GEMINI_API_KEY 입력
```

## 문서

- [아키텍처](docs/architecture.md) — 디렉터리 구조, 데이터 모델, API Routes, 상태 흐름
- [배포](docs/deployment.md) — Vercel 배포, 환경 변수, MongoDB Atlas 설정
- [테스트](docs/testing.md) — 테스트 전략 및 대상
- [체크리스트](docs/checklist.md) — 구현 범위
- [인터랙션](docs/interactions.md) — 화면별 사용자 동작 정의
