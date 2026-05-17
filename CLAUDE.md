# commit-to-blog

GitHub 활동 데이터를 분석해 자동으로 개발 블로그를 생성하는 서비스. 사용자가 저장소/브랜치/커밋을 선택하면 LLM이 변경 사항을 요약해 블로그 초안을 작성하고, 사용자가 편집기에서 다듬어 저장/발행한다.

## Stack

- **Next.js 16** — App Router, Turbopack, TypeScript, Server Components 우선
- **Tailwind CSS v4** — CSS 기반 설정 (`@import "tailwindcss"`, `tailwind.config` 없음)
- **Prisma 7** — `prisma-client` generator + `@prisma/adapter-pg` driver adapter (Neon Postgres)
- **pnpm** — `onlyBuiltDependencies`로 빌드 스크립트 명시 승인
- **Testing** — Vitest (unit), Playwright (E2E), MSW (외부 API 모킹)
- **UI** — shadcn/ui (new-york / neutral, Tailwind v4 CSS vars, lucide-react 아이콘)
- **DX** — Prettier (+ prettier-plugin-tailwindcss), eslint-config-prettier, Husky + lint-staged
- **외부 통합 (예정)**: GitHub OAuth + REST API (repo/branch/commit), OpenAI 등 LLM

## Folder structure

```
src/app/
├── _components/           # 여러 라우트가 공유하는 UI
│   └── ui/                # shadcn/ui 프리미티브 (CLI가 여기로 추가)
├── _hooks/                # 공유 React 훅 (shadcn 훅 등)
├── _lib/                  # 여러 라우트가 공유하는 서버 코드/유틸
│   ├── prisma.ts          # PrismaClient 싱글톤 (+ PrismaPg adapter)
│   └── utils.ts           # cn() 등 클라/공용 유틸
├── (main)/                # 인증된 메인 영역 (공통 헤더 layout)
│   ├── layout.tsx         # 상단 네비 (My Blog / Saved / Settings)
│   ├── page.tsx           # `/`        — My Blog (블로그 생성 플로우)
│   ├── saved/page.tsx     # `/saved`   — 저장된 포스트 카드 그리드
│   └── settings/page.tsx  # `/settings`
├── api/                   # Route Handlers (서버 전용)
│   ├── auth/              # NextAuth (또는 Auth.js) — GitHub OAuth
│   ├── github/            # repos / branches / commits 프록시
│   ├── ai/                # LLM 요약 엔드포인트
│   └── posts/             # 포스트 CRUD
├── layout.tsx             # 루트 layout (html/body, metadata)
├── globals.css            # `@import "tailwindcss";`
└── favicon.ico

prisma/
└── schema.prisma          # generator output → src/generated/prisma

prisma.config.ts           # Prisma 7 설정 (dotenv 로딩, schema/migrations/datasource)

src/generated/             # gitignore — `prisma generate` 산출물
└── prisma/

tests/
├── unit/                  # Vitest (선택) — 라우트 안에 colocated `*.test.ts`도 가능
├── msw/                   # MSW handlers (GitHub/OpenAI 응답 모킹)
└── e2e/                   # Playwright 스펙

vitest.config.ts           # alias, setupFiles, include/exclude
vitest.setup.ts            # MSW server.listen/close
playwright.config.ts       # webServer: pnpm dev, baseURL: localhost:3000

components.json            # shadcn/ui 설정 (aliases가 app/_* 가리킴)
prettier.config.mjs        # Prettier + prettier-plugin-tailwindcss
.prettierignore
.lintstagedrc.json         # commit 전 eslint --fix + prettier --write
.husky/pre-commit          # `pnpm exec lint-staged`
```

## Conventions

### 어디에 두지?

- **특정 라우트에서만 쓰는 컴포넌트**: 그 라우트 폴더 안에 `_components/` 만들고 거기. (예: `src/app/(main)/saved/_components/PostCard.tsx`)
- **여러 라우트가 공유**: `src/app/_components/`.
- **서버 전용 헬퍼 / 외부 클라이언트** (DB, GitHub, LLM): `src/app/_lib/`. 예: `_lib/github.ts`, `_lib/ai.ts`.
- **모든 비-라우트 폴더는 `_` 접두사**. Next.js가 라우팅에서 자동 제외함.

### 컴포넌트

- 기본은 **Server Component**. `"use client"`는 인터랙션/브라우저 API/상태 훅이 필요할 때만.
- 데이터 페치는 가능하면 Server Component에서 직접 (`prisma` import).
- 클라이언트로 내려보내는 데이터는 직렬화 가능해야 함 (Date는 string, Decimal 주의).

### 라우트 그룹

- `(main)` — 로그인 후 사용하는 영역. 추후 `(auth)/login` 추가 시 별도 layout으로 분리.

### Prisma

- 모든 서버 코드에서 `import { prisma } from "@/app/_lib/prisma"` 사용. 직접 `new PrismaClient()` 금지 (dev 모드 connection 폭주).
- 스키마 수정 후: `pnpm exec prisma migrate dev --name <설명>` → 자동으로 `prisma generate` 실행됨.
- 생성된 클라이언트 import 경로는 `@/generated/prisma/client` (schema.prisma의 `output`에 따름).

### 환경 변수

- 모든 secret은 `.env` (gitignored). 현재 `DATABASE_URL` (Neon) 보유.
- 추가 예정: `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`, `NEXTAUTH_SECRET`, `OPENAI_API_KEY` 등.

### Path alias

- `@/*` → `src/*`. 새 alias 추가 금지 — 일관성 유지.

### UI (shadcn/ui)

- 새 프리미티브 추가: `pnpm dlx shadcn@latest add <name>` (예: `button`, `dialog`, `card`).
- `components.json`의 `aliases`가 우리 구조(`@/app/_components`, `@/app/_lib/utils` 등)를 가리키도록 설정되어 있어 CLI가 자동으로 올바른 위치에 파일 생성.
- 테마 토큰은 `src/app/globals.css`의 CSS 변수 (`--background`, `--primary` 등)에 정의. light/dark 모두 정의되어 있음 — 라이트 한정으로 가려면 `.dark` 블록 제거.
- 다크 모드 토글이 필요해지면 `next-themes` 추가 후 root에서 `class="dark"` 토글.
- `cn(...classes)` 헬퍼는 `@/app/_lib/utils`에서 import. 모든 컴포넌트에서 className 결합 시 사용.
- 아이콘은 `lucide-react`. (예: `import { GitBranch } from "lucide-react"`)

### Formatting & 커밋 훅

- Prettier 설정: 100자, 더블쿼트, trailing comma all, semi. `prettier-plugin-tailwindcss`가 Tailwind 클래스 자동 정렬.
- `pnpm format`으로 전체 포맷, `pnpm format:check`로 검증 (CI용).
- ESLint와 Prettier 규칙 충돌은 `eslint-config-prettier`로 차단.
- `git commit` 시 Husky가 `lint-staged` 트리거 → 스테이징된 파일에만 `eslint --fix` + `prettier --write` 실행. **훅을 건너뛰는 `--no-verify`는 금지** (CI에서 잡혀도 어차피 다시 고침).
- 새 클론 시 `pnpm install`이 `prepare: husky`로 훅 자동 등록.

### Testing

**무엇을 테스트하나**

- **Vitest** — 순수 유틸 함수, 데이터 변환, 비즈니스 로직, Route Handler 로직. 컴포넌트 단위 테스트는 **하지 않음** (초기 UI churn 시 유지보수 비용 큼 → E2E가 대체).
- **Playwright** — 골든 플로우 (저장소 선택 → 커밋 선택 → AI 요약 → 편집 → 저장 → 발행). 화면별이 아니라 사용자 시나리오 단위로 작성.
- **MSW** — GitHub/OpenAI 등 외부 HTTP 호출은 **항상** MSW 핸들러로 모킹. 테스트에서 진짜 외부 API를 때리지 않는다.

**파일 위치**

- 유닛 테스트: source 옆에 colocated (`foo.ts` + `foo.test.ts`) **또는** `tests/unit/`. 둘 다 vitest가 픽업함.
- E2E: `tests/e2e/*.spec.ts`.
- MSW 핸들러: `tests/msw/handlers.ts`. 핸들러는 happy path 기본값으로 두고, 테스트별로 `server.use(...)`로 오버라이드.

**DB 통합 테스트**

- Prisma를 거치는 통합 테스트는 **실 Neon DB**에 붙어 검증. 단, 프로덕션 DB가 아니라 **Neon 브랜치**를 따로 만들어 `.env.test`에 `DATABASE_URL` 갈아끼움.
- 각 테스트는 트랜잭션으로 감싸 롤백하거나, `beforeEach`에서 truncate. (구현은 추후)

**스크립트**

```bash
pnpm test           # vitest watch
pnpm test:run       # vitest run (CI용)
pnpm test:e2e       # playwright test (자동으로 dev 서버 부팅)
pnpm typecheck      # tsc --noEmit
```

**브라우저 설치**

- Playwright 첫 셋업 시 `pnpm exec playwright install chromium` 한 번 실행 필요.

## Commands

```bash
pnpm dev                              # 개발 서버 (Turbopack)
pnpm build                            # prisma generate → next build
pnpm lint                             # ESLint
pnpm format                           # Prettier write
pnpm format:check                     # Prettier check (CI)
pnpm typecheck                        # tsc --noEmit
pnpm test:run                         # vitest run
pnpm test:e2e                         # playwright test
pnpm dlx shadcn@latest add <name>     # shadcn UI 프리미티브 추가
pnpm exec prisma migrate dev --name X # 마이그레이션 생성/적용
pnpm exec prisma generate             # 클라이언트만 재생성
pnpm exec prisma studio               # DB GUI
```

## Out of scope / not yet decided

- 인증 라이브러리 선택 (NextAuth v5 vs Auth.js 등) — 미정.
- LLM 공급자 선택 (OpenAI / Anthropic 등) — 미정.
- Post 모델 스키마 (필드, 관계) — 미정. `prisma/schema.prisma`에 아직 모델 없음.
