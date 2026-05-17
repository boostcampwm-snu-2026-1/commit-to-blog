# commit-to-blog

GitHub 커밋/PR을 LLM으로 블로그 초안화하는 서비스.

- 설계: [docs/week1-plan.md](docs/week1-plan.md)
- 진행: [CHECKLIST.md](CHECKLIST.md)
- 협업 가이드: [CLAUDE.md](CLAUDE.md)

## 구조
```
client/   Vite + React + Tailwind (5173)
server/   Express BFF (4000)
docs/     주차별 플랜
```

## 실행
```bash
cp .env.example .env   # GITHUB_TOKEN, OPENAI_API_KEY 채우기
npm install
npm run dev            # client + server 동시 실행
```
