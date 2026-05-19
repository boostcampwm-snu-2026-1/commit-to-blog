# AGENT.md

이 파일은 Codex가 이 저장소에서 `github_blog_generator_plan.md`와 제공된 Figma 디자인을 기준으로 일관되게 개발하기 위한 작업 지침이다.

## 프로젝트 목표

GitHub 활동 데이터를 기반으로 자동 개발 블로그 초안을 생성하고, 사용자가 편집/저장/발행 상태 변경까지 할 수 있는 MVP 서비스를 만든다.

MVP의 발행 기능은 외부 블로그 플랫폼 연동이 아니다. `Post.status`를 `"draft"`에서 `"published"`로 변경하고 `publishedAt`을 기록하는 수준으로 구현한다.

## 기준 문서와 디자인

항상 다음 문서를 우선 기준으로 삼는다.

- 기능/아키텍처 기준: `github_blog_generator_plan.md`
- 실행 단계 기준: `github_blog_generator_development_steps.md`
- 디자인 기준: 아래 Figma 프레임

Figma 디자인 링크:

- Login page: https://www.figma.com/design/28BANhxoFK9j7Eok0RAWPi/%EA%B9%83%ED%97%99-%EB%B8%94%EB%A1%9C%EA%B7%B8?node-id=6-2&t=Q1vdQ3cWI391u9JO-0
- Main / My blog: https://www.figma.com/design/28BANhxoFK9j7Eok0RAWPi/%EA%B9%83%ED%97%99-%EB%B8%94%EB%A1%9C%EA%B7%B8?node-id=11-18&t=Q1vdQ3cWI391u9JO-0
- Main / Draft: https://www.figma.com/design/28BANhxoFK9j7Eok0RAWPi/%EA%B9%83%ED%97%99-%EB%B8%94%EB%A1%9C%EA%B7%B8?node-id=15-142&t=Q1vdQ3cWI391u9JO-0

Figma file key는 `28BANhxoFK9j7Eok0RAWPi`이다. 주요 node id는 로그인 `6:2`, My blog `11:18`, Draft `15:142`이다.

## 기술 스택

프론트엔드:

- React + TypeScript + Vite
- React Router
- TanStack Query
- Zustand 또는 Context API
- Tailwind CSS + shadcn/ui
- Markdown editor 또는 Tiptap

백엔드:

- Express + TypeScript
- PostgreSQL
- Prisma
- GitHub OAuth
- GitHub REST API
- OpenAI Responses API + Structured Outputs

테스트:

- Vitest
- React Testing Library
- Supertest
- Playwright

## 핵심 MVP 범위

GitHub 연동:

- GitHub OAuth 로그인
- 사용자 repository 목록 조회
- repository 선택
- branch 목록 조회 및 선택
- commit 목록 조회
- commit 다중 선택
- 선택 commit의 diff / changed files 조회

블로그 생성:

- 선택한 commit message, changed files, diff 요약을 백엔드로 전달
- OpenAI Structured Outputs로 블로그 초안 생성
- 응답 구조는 `title`, `summary`, `tags`, `bodyMarkdown` 중심으로 유지
- 실제 diff에 없는 내용을 과장하지 않도록 프롬프트를 제한

편집/저장:

- Markdown 초안 표시
- 제목, 요약, 태그, 본문 수정
- draft 저장
- 저장된 글 상세 보기
- 다시 편집
- published 상태 변경

## 권장 라우트

프론트엔드 라우트:

```txt
/login
/main/myBlog
/main/draft
/main/setting
/generate
/generate/repository
/generate/commits
/generate/preview
/posts/:postId
/posts/:postId/edit
```

백엔드 API:

```txt
GET    /api/auth/github
GET    /api/auth/github/callback
GET    /api/auth/me
POST   /api/auth/logout

GET    /api/github/repositories
GET    /api/github/repositories/:owner/:repo/branches
GET    /api/github/repositories/:owner/:repo/commits?branch=main
GET    /api/github/repositories/:owner/:repo/commits/:sha

POST   /api/post-generator/generate

GET    /api/posts
GET    /api/posts/:postId
POST   /api/posts
PATCH  /api/posts/:postId
PATCH  /api/posts/:postId/publish
DELETE /api/posts/:postId
```

## 데이터 모델 원칙

핵심 모델:

- `User`
- `RepositorySnapshot`
- `CommitSelection`
- `Post`

`Post`는 최소한 다음 정보를 포함해야 한다.

- `title`
- `summary`
- `bodyMarkdown`
- `tags`
- `repoName`
- `branchName`
- `commitShas`
- `status: "draft" | "published"`
- `visibility: "private" | "public"`
- `publishedAt`

GitHub access token은 절대 프론트엔드에 노출하지 않는다. DB에는 암호화해서 저장한다. 세션은 httpOnly cookie 기반으로 관리한다.

## 프론트엔드 구조 원칙

가능하면 다음 구조를 따른다.

```txt
src/
  app/
  pages/
  features/
    auth/
    github/
    post-generator/
    posts/
  shared/
    components/
    types/
    utils/
```

서버에서 가져오는 데이터는 TanStack Query로 관리한다.

- `currentUser`
- `repositories`
- `branches`
- `commits`
- `commitDetail`
- `posts`
- `postDetail`

생성 플로우에서만 쓰는 임시 UI 상태는 Zustand 또는 Context로 관리한다.

```ts
type GenerateFlowState = {
  selectedRepository: Repository | null;
  selectedBranch: string | null;
  selectedCommitShas: string[];
  generatedDraft: GeneratedPostDraft | null;
};
```

## Figma 기반 디자인 시스템

제공된 Figma 디자인을 UI의 시각 기준으로 삼는다. 구현 전에는 가능한 경우 Figma MCP의 design context를 먼저 확인한다.

### Figma 구현 프롬프트 규칙

Figma 디자인을 활용해 UI를 구현하는 작업에는 항상 아래 내용을 포함한다.

```txt
Use the Figma skill to implement this design in the current React project.

Figma link:
[여기에 Figma selection link 붙여넣기]

Requirements:
- Start with get_design_context for the exact selected frame.
- Run get_screenshot before coding.
- Reuse existing components, styles, and design tokens in this repo.
- Do not create a parallel design system.
- Match spacing, typography, colors, layout, and responsive behavior.
- If the design context is truncated, use get_metadata and fetch only the needed nodes.
- After implementation, run the app and check the result visually.
```

실제 작업 시에는 `[여기에 Figma selection link 붙여넣기]`를 구현 대상 frame 또는 selection의 Figma URL로 교체한다. URL에 `node-id`가 포함되어야 한다.

Codex는 위 요구사항에 따라 다음 순서로 진행한다.

1. 선택된 frame에 대해 `get_design_context`를 먼저 실행한다.
2. 코딩 전에 같은 frame의 `get_screenshot`을 실행해 시각 기준을 확보한다.
3. 현재 repo의 기존 컴포넌트, 스타일, design token을 우선 재사용한다.
4. 별도의 병렬 디자인 시스템을 만들지 않는다.
5. spacing, typography, colors, layout, responsive behavior를 Figma 기준에 맞춘다.
6. design context가 잘리면 `get_metadata`로 구조를 확인하고 필요한 node만 추가 조회한다.
7. 구현 후 앱을 실행하고 브라우저 또는 screenshot으로 결과를 시각 확인한다.

### 브랜드 톤

- 서비스명은 `Smart blog`로 표시한다.
- 전체 톤은 개발자 도구지만 딱딱한 SaaS보다는 가볍고 시각적인 블로그 관리 도구에 가깝다.
- 로그인 화면은 회색 배경과 다채로운 기술 스택 pill 장식으로 첫인상을 만든다.
- 메인 화면은 컬러풀한 그라데이션 배경 위에 반투명 카드와 상단바를 올리는 스타일이다.

### 색상

핵심 색상:

- Page gray: `#e1e1e1`
- Text primary: `#000000`
- Text muted: `rgba(0, 0, 0, 0.5)` 또는 `rgba(0, 0, 0, 0.6)`
- Accent blue: `#0088ff`
- Surface glass: `rgba(255, 255, 255, 0.1)`
- Surface light: `#ffffff`
- Primary button: `#000000`

메인 배경:

- Figma의 이미지/그라데이션 배경을 우선 사용한다.
- 직접 재현해야 할 경우 초록, 분홍, 파랑, 노랑이 부드럽게 섞이는 full-page gradient를 사용한다.
- 배경은 화면 전체를 덮고, 주요 콘텐츠는 그 위에 배치한다.

### 타이포그래피

- 기본 영문 폰트: Inter
- 한글 폰트: Noto Sans KR
- 브랜드명: 36px, Medium
- 상단 메뉴: 28px, Medium/Semi Bold
- 페이지 제목: 36px, Bold
- 페이지 설명: 24px, Regular
- 카드 제목: 24px, Medium
- 카드 본문: 16px, Regular
- 메타 텍스트와 branch badge: 12px, Regular

폰트 크기는 viewport width에 따라 무리하게 스케일하지 않는다. 모바일에서는 레이아웃을 바꾸고 텍스트 크기는 단계적으로 조정한다.

### Layout

기준 Figma 프레임은 `1440 x 1024`이다.

Desktop 기준:

- 상단바 높이: 100px
- 상단바 좌우 padding: 40px
- 브랜드 영역 gap: 30px
- 브랜드와 메뉴 그룹 사이 gap: 100px
- 메뉴 item gap: 50px
- 본문 시작 위치: 좌측 약 70px, 상단 약 152px
- 카드 리스트 시작 위치: 좌측 약 70px, 상단 약 288px
- 카드 gap: 50px

반응형 구현:

- 1440px에서는 Figma와 최대한 같은 배치로 보이게 한다.
- 태블릿/모바일에서는 카드 3열 고정을 유지하지 말고 `grid-template-columns`로 1-2열에 자연스럽게 줄인다.
- 상단 메뉴가 좁아지면 nav item을 숨기거나 hamburger drawer로 전환한다.
- 카드와 버튼 안의 텍스트가 넘치지 않게 줄바꿈, 말줄임, min-width 제약을 적용한다.

### Navigation

상단바 구성:

- 왼쪽 hamburger icon
- `Smart blog` 브랜드명
- 메뉴: `My blog`, `Draft`, `Setting`
- 오른쪽 profile icon

활성 메뉴:

- 활성 item: black
- 비활성 item: `rgba(0, 0, 0, 0.5)`
- My blog 화면에서는 `My blog`만 black
- Draft 화면에서는 `Draft`만 black

상단바 스타일:

- 높이 100px
- `rgba(255, 255, 255, 0.1)` 배경
- `0px 3px 6px rgba(0, 0, 0, 0.1)` 그림자

### Hamburger Icon

Figma 기준:

- 컨테이너 40px
- 막대 높이 8px
- 첫 번째/세 번째 막대 너비 40px
- 두 번째 막대 너비 30px
- radius 5px
- 색상 `rgba(0, 0, 0, 0.6)`

가능하면 lucide 아이콘 대신 이 Figma 스타일을 직접 컴포넌트로 재현한다.

### Login Page

로그인 화면:

- 배경: `#e1e1e1`
- 좌상단에 hamburger + `Smart blog`
- 중앙 하단 쪽에 GitHub 로그인 CTA
- 하단 영역에 기술 스택 pill들이 랜덤한 각도로 배치됨

GitHub 로그인 CTA:

- pill 형태, radius 100px
- padding 20px
- 내부 gap 40px
- white border 2px
- 배경 `rgba(241, 241, 241, 0.5)`
- shadow `0px 6px 10px rgba(0, 0, 0, 0.25)`
- 내부 하이라이트 shadow 사용
- GitHub logo와 `Github 계정으로 로그인하기` 두 줄 텍스트
- 텍스트 크기 36px, Bold

기술 스택 pill:

- radius 62px
- padding x 30px, y 10px
- border `rgba(255, 255, 255, 0.5)`
- shadow `0px 4px 2px rgba(0, 0, 0, 0.2)`
- inset highlight `inset 0px 7px 10px rgba(255, 255, 255, 0.25)`
- 텍스트 36px, Medium
- 각 기술의 브랜드 색을 유지하되, 실제 구현에서는 장식 요소이므로 접근성 tree에서는 숨길 수 있다.

### Blog Card

카드 기본:

- desktop width 400px
- My blog 카드 높이 약 400px
- Draft 카드 높이 약 450px
- padding 20px
- gap 20px
- 배경 `rgba(255, 255, 255, 0.1)`
- shadow `0px 4px 10px rgba(0, 0, 0, 0.2)`
- inset highlight `inset 0px 100px 20px rgba(255, 255, 255, 0.3)`
- border radius는 Figma상 거의 없지만, 구현 시 0-4px 범위로 제한한다.

카드 내용:

- 상단 row: branch badge + 날짜
- branch badge: white background, radius 7px, x padding 5px, text 12px, accent blue
- 날짜: 12px, muted
- 제목: 24px, Medium
- 썸네일: 높이 185px, width 100%, object-fit cover
- 요약: 16px, 한글/영문 혼용 가능, 긴 내용은 말줄임 처리

Draft 카드 액션:

- 카드 하단에 `Edit`, `Post` 버튼 2개
- 버튼 gap 30px
- `Edit`: black background, white text
- `Post`: white background, black text
- radius 약 29-34px
- padding 10px
- shadow와 inset highlight를 적용

### Draft Page

Draft page copy:

- 제목: `임시 저장 글`
- 설명: `AI가 생성한 초안과 백업된 커밋 로그 목록입니다.`

우측 상단 본문 영역에 `+ 블로그 생성` 버튼을 둔다.

`+ 블로그 생성` 버튼:

- top 영역 우측 배치
- radius 29px
- padding x 15px, y 10px
- 배경 `rgba(255, 255, 255, 0.1)`
- border `rgba(255, 255, 255, 0.2)`
- text 24px
- 클릭 시 `/generate/repository`로 이동

### My Blog Page

My blog page는 published 또는 저장된 글 목록을 보여준다.

현재 Figma의 placeholder copy:

- 제목: `인삿말 인삿말`
- 설명: `부가 설명 부가 설명 부가 설명 부가 설명`

구현 시 실제 서비스 문맥에 맞게 다음처럼 조정할 수 있다.

- 제목: `내 블로그`
- 설명: `GitHub 활동으로 생성하고 발행한 글을 모아봅니다.`

단, 사용자가 Figma 문구와 완전 일치를 요구하면 Figma 문구를 우선한다.

## UI 구현 원칙

- Figma에서 받은 코드는 그대로 붙여넣지 말고 프로젝트 구조와 컴포넌트 구조에 맞게 재구성한다.
- absolute positioning은 배경 장식처럼 필요한 경우에만 사용한다.
- 카드 목록, 상단바, 페이지 레이아웃은 responsive flex/grid로 구현한다.
- Figma asset URL은 임시 URL이므로 장기적으로 필요한 이미지는 프로젝트 asset으로 저장하거나 대체 가능한 CSS/이미지 전략을 둔다.
- shadcn/ui를 사용하더라도 Figma의 radius, shadow, typography, spacing을 우선한다.
- nested card 구조를 만들지 않는다.
- 버튼/카드 내부 텍스트가 overflow 되지 않도록 한다.
- 데이터가 없을 때 empty state를 제공한다.
- 로딩, 에러, 인증 만료 상태를 빠뜨리지 않는다.

## 백엔드 구현 원칙

- route, controller, service, repository 계층을 구분한다.
- GitHub API 호출은 `github.service.ts`에 모은다.
- OpenAI 호출은 `openai.service.ts`에 모은다.
- GitHub 데이터와 AI 생성을 연결하는 로직은 `post-generator.service.ts`에 둔다.
- Post CRUD는 `posts.service.ts`와 repository 계층으로 분리한다.
- 입력 검증은 zod 같은 schema 기반 검증을 사용한다.
- async error는 공통 `asyncHandler`와 error middleware로 처리한다.

## OpenAI 생성 원칙

Structured Outputs를 사용해 다음 형식을 안정적으로 반환한다.

```ts
type GeneratedPostDraft = {
  title: string;
  summary: string;
  tags: string[];
  bodyMarkdown: string;
};
```

프롬프트 제약:

- 제공된 commit message, changed files, diff summary에 근거해서만 작성한다.
- 모르는 내용은 추측하지 않는다.
- 변경 의도, 구현 내용, 영향, 배운 점을 개발 블로그 문체로 정리한다.
- 과도한 홍보 문구를 피한다.
- 코드 블록은 필요한 경우에만 포함한다.

긴 diff 처리:

- 파일별 additions/deletions와 filename은 유지한다.
- patch는 길이 제한을 두고 축약한다.
- 중요한 변경 파일 위주로 요약한다.

## 보안 원칙

- GitHub access token은 LocalStorage/sessionStorage에 저장하지 않는다.
- access token은 서버 DB에 암호화 저장한다.
- 클라이언트에는 인증 여부와 사용자 표시 정보만 반환한다.
- 세션 식별자는 httpOnly cookie로 관리한다.
- CORS는 프론트엔드 origin으로 제한한다.
- 모든 post 조회/수정/삭제/publish는 `userId`로 접근 제어한다.
- private repository 기반 글은 기본 visibility를 `private`로 둔다.

## 테스트 원칙

백엔드:

- auth route
- GitHub route mock
- post-generator route mock
- posts CRUD
- publish 상태 변경
- userId 접근 제어

프론트엔드:

- Login page CTA
- My blog card rendering
- Draft card actions
- Repository select
- Commit multi-select
- PostEditor 입력/미리보기/저장

E2E:

- 로그인 mock
- repository 선택
- branch 선택
- commit 선택
- AI 생성 mock
- draft 저장
- `/main/draft` 표시
- edit
- publish 상태 변경

## 작업 방식

- 구현 전 관련 파일과 기존 구조를 먼저 확인한다.
- 사용자 변경 사항을 되돌리지 않는다.
- 대규모 기능은 작은 단계로 나눠 구현한다.
- 파일 생성/수정 후 가능한 범위에서 타입 체크와 테스트를 실행한다.
- 테스트를 실행하지 못한 경우 이유를 명확히 남긴다.
- 디자인 구현 작업은 Figma 기준과 실제 브라우저 결과를 함께 확인한다.
