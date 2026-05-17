# commit-to-blog

GitHub 커밋 로그를 LLM으로 분석해 개발 블로그 초안을 생성·편집·저장하는 서비스.

## 문서
- [1주차 계획 — 기획 & 설계](docs/week1-plan.md)

## 스택 (계획)
- Frontend: Vite + React + TypeScript, Tailwind CSS, React Router, TanStack Query, Zustand
- Backend: Express + TypeScript, Octokit, OpenAI SDK
- 영속성: JSON 파일 (MVP)
- 인증: GitHub PAT + `.env`
