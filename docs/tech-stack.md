# 기술 스택 (Tech Stack)

> 선택한 도구와 **이유** 를 함께 적는다 — PDF 가이드 "선택한 도구에 이유를 말할 수 있는가?" 요구사항.

---

## 한눈에 보기

| 영역 | 선택 | 대안 |
|---|---|---|
| 모노레포 구조 | npm workspaces (`apps/client`, `apps/server`) | pnpm, turborepo, 평탄 구조 |
| 프론트엔드 프레임워크 | React 18 + Vite + TypeScript | Next.js, Remix |
| 스타일링 | Tailwind CSS | CSS Modules, styled-components |
| 클라이언트 상태 | React Query (서버 상태) + `useState` (UI 상태) | Zustand, Redux Toolkit |
| 라우팅 | React Router v6 | Tanstack Router |
| 서버 프레임워크 | Express + TypeScript | Fastify, Hono |
| 서버 런타임 | Node 20 + `tsx` (개발) / `tsc` (빌드) | ts-node, esbuild-register |
| GitHub API | Octokit (GraphQL + REST) | 직접 fetch |
| LLM | OpenAI Node SDK (Chat Completions) | LangChain, raw fetch |
| 환경변수 | dotenv | env-cmd |
| 영속화 | JSON 파일 (`data/posts.json`) | SQLite (better-sqlite3), Postgres |
| 검증 | Zod (런타임 스키마) | Yup, manual |
| 포매팅 | Prettier | dprint |
| 린트 | ESLint (`@typescript-eslint`) | Biome |

---

## 선택 근거

### 모노레포 — npm workspaces

- `apps/client` 와 `apps/server` 가 `packages/shared` 의 타입 (Post, Repo, Commit) 을 공유해야 한다.
- 같은 도메인 타입을 두 번 작성하면 API 계약이 어긋났을 때 컴파일 타임에 못 잡는다.
- **선택 근거**: pnpm/turborepo 까지 가면 학습 부담이 커진다. npm workspaces 는 추가 의존성 0, `"workspaces": ["apps/*", "packages/*"]` 한 줄로 끝.

### React + Vite + TypeScript

- **React**: 학습 키워드에 명시. 컴포넌트 단위 사고에 적합.
- **Vite**: Next 보다 단순, dev server 가 빠르고 설정이 적다. PDF 아키텍처 다이어그램이 "React Client + Express Server" 로 명확히 분리돼 있어 풀스택 프레임워크(Next) 보다는 SPA 가 정합적.
- **TypeScript**: GitHub API / OpenAI 응답이 중첩 객체라서, 타입이 없으면 깨지는 지점을 찾기 어렵다. shared types 와 결합 시 효과가 크다.

### Tailwind CSS

- PDF 예시 화면은 카드/패널 위주의 정형 레이아웃 → utility-first 와 궁합 좋음.
- 컴포넌트 단위 스타일링 (CSS Modules) 보다 빠르게 시안에 근접 가능.
- 단점: 클래스 문자열이 길어짐 → `clsx` 로 조건부 클래스만 처리.

### React Query (서버 상태) + `useState` (UI 상태)

- GitHub / 우리 API 를 호출하는 코드는 **로딩, 에러, 캐시, 재시도** 가 다 필요하다 → React Query 가 정확한 도구.
- 사용자 입력(편집기 텍스트, 검색어) 같은 순수 UI 상태는 `useState` 로 충분.
- Zustand/Redux 같은 전역 상태 라이브러리는 이 규모에서 과한 인프라.

### React Router v6

- 화면 3종(`/`, `/create`, `/posts/:id/edit`) → 라우터 필요.
- React 18 호환, 학습 비용 거의 없음.

### Express + TypeScript

- **학습 키워드** 에 명시. 코스 표준.
- Fastify/Hono 가 빠르지만, 이 규모에서는 의미 있는 차이 없음 + 자료/예제 풍부도에서 Express 가 우세.
- 미들웨어 흐름이 단순하고, 학생 대상 디버깅 친화적.

### Octokit (GraphQL + REST)

- **PDF 학습 키워드** 에 `graphql`, `openapi` 모두 명시 → Octokit 은 둘 다 지원.
- 인증, rate-limit 헤더, 페이지네이션이 SDK 안에 녹아 있어서 직접 fetch 보다 견고.
- GraphQL: `viewer { repositories(first: 30) { nodes { ... } } }` 한 번에 필요한 필드만 가져옴.
- REST: `compare` 엔드포인트로 diff 가져올 때 등 GraphQL 이 약한 영역.

### OpenAI Node SDK

- 1순위 LLM 공급자, 가장 안정적인 SDK.
- 12주차 도입 시 `chat.completions.create({...})` 한 번 호출로 끝.
- 비용: `gpt-4o-mini` 로 고정해 학생 부담 최소화.

### JSON 파일 영속화

- 단일 사용자 + 단일 프로세스 가정 → 락/동시성 문제 없음.
- 12주차 종료 후 SQLite/Postgres 로 옮기는 비용도 적다 (Repository 인터페이스로 추상화).
- 11~12주차 안에 데이터 모델이 바뀔 가능성이 커서, 마이그레이션 부담이 없는 JSON 이 학습 친화적.

### Zod

- API 입력 검증과 LLM 응답 파싱에 동일한 도구를 쓸 수 있음.
- TypeScript 타입과 런타임 스키마를 한 소스에서 정의 (`z.infer<typeof Schema>`).

---

## 일부러 도입하지 않은 것

- **Storybook / 단독 컴포넌트 카탈로그** — 2주 스코프 초과
- **테스트 프레임워크 (Vitest/Jest)** — 12주차 후반에 핵심 path 만 도입 (`docs/test-plan.md` 참조)
- **상태 라이브러리(Zustand/Redux)** — 위 설명대로 React Query 로 충분
- **CSS-in-JS** — Tailwind 와 중복
- **Docker** — 로컬 개발만 한다는 가정

## 버전 핀 (계획)

```
react ^18.3
react-dom ^18.3
react-router-dom ^6.26
@tanstack/react-query ^5.51
tailwindcss ^3.4
vite ^5.4
typescript ^5.5
express ^4.19
@octokit/graphql ^8
@octokit/rest ^21
openai ^4.56
zod ^3.23
dotenv ^16.4
tsx ^4.19   (dev)
```
