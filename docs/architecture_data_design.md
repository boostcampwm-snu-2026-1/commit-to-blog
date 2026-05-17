# Smart Blog - 아키텍처/데이터 설계 (Week 1)

## 1) 시스템 흐름

```text
[Browser UI]
   -> [React Client (TanStack Query + Local State)]
   -> [Express Server (API Orchestration + Validation + Logging)]
   -> [GitHub API / Gemini API]
   -> [MongoDB]
```

상세 요청 흐름:
1. 사용자가 Client에서 저장소/커밋 선택 요청
2. Client는 Server API 호출 (`/repos`, `/repos/:owner/:repo/commits`, `/commits/:sha/diff`)
3. Server는 GitHub API 호출 후 가공/검증하여 Client에 반환
4. 사용자가 인터뷰 시작 시 Client는 Server API 호출 (`/interviews/start`)
5. Server는 Diff를 기준으로 Gemini API에 질문 생성 요청
6. Server는 구조화 JSON 응답 검증 후 `interviewSessions`, `interviewTurns` 저장
7. 사용자의 답변/힌트/해설/스킵 액션마다 Server가 턴 업데이트
8. 초안 생성 시 Server가 인터뷰 이력 기반으로 Markdown 초안 생성 후 반환/저장

원칙:
- 외부 API 호출은 Server만 수행
- `GITHUB_TOKEN`, `GEMINI_API_KEY`는 서버 환경변수로만 주입
- Client는 민감정보를 보유/노출하지 않음

## 2) 화면별 필요 데이터

### A. 저장소/커밋 선택 화면
필요 데이터:
- `repoList`: `{ id, fullName, defaultBranch, isPrivate, updatedAt }[]`
- `commitList`: `{ sha, message, author, committedAt }[]`
- `selectedRepo`, `selectedCommitSha`

API 소스:
- `GET /api/repos`
- `GET /api/repos/:owner/:repo/commits`

### B. Diff 확인/인터뷰 시작 화면
필요 데이터:
- `commitDiff`: `{ filesChanged, additions, deletions, patch[] }`
- `interviewSessionPreview`: `{ repo, commitSha, diffSummary }`

API 소스:
- `GET /api/repos/:owner/:repo/commits/:sha/diff`
- `POST /api/interviews/start`

### C. AI 튜터 인터뷰 룸
필요 데이터:
- `session`: `{ sessionId, status, currentTurnIndex, startedAt }`
- `currentQuestion`: `{ turnId, question, hint, conceptTags }`
- `userAnswerDraft`: `string`
- `turnHistory`: `{ turnIndex, actionType, userAnswer, feedback, expectedAnswer }[]`

API 소스:
- `GET /api/interviews/:sessionId`
- `POST /api/interviews/:sessionId/answer`
- `POST /api/interviews/:sessionId/hint`
- `POST /api/interviews/:sessionId/explain`
- `POST /api/interviews/:sessionId/skip`

### D. 초안 검토/수정/발행 화면
필요 데이터:
- `draft`: `{ draftMarkdown, mode(success|unknown|skip), summary }`
- `postForm`: `{ title, tags, contentMarkdown, status }`

API 소스:
- `POST /api/posts/draft`
- `POST /api/posts`
- `PATCH /api/posts/:postId`

### E. 포스트 목록/재편집 화면
필요 데이터:
- `postCards`: `{ postId, title, status, updatedAt, repo, commitSha }[]`
- `selectedPostDetail`: `{ title, contentMarkdown, tags, createdAt, updatedAt }`

API 소스:
- `GET /api/posts`
- `GET /api/posts/:postId`

## 3) 인터뷰 상태 흐름(State Machine)

상태:
- `IDLE`: 시작 전
- `READY`: 질문 생성 완료
- `IN_PROGRESS`: 사용자 액션 진행 중
- `ANSWERED`: 답변 제출 후 피드백 수신
- `HINT_VIEWED`: 힌트 확인
- `EXPLAINED`: 모르겠어요(해설) 선택
- `SKIPPED`: 질문 스킵
- `COMPLETED`: 세션 종료(초안 생성 가능)
- `FAILED`: 외부 API 실패/검증 실패

전이:
1. `IDLE -> READY`: 인터뷰 시작 + 질문 생성 성공
2. `READY -> IN_PROGRESS`: 사용자 입력 시작
3. `IN_PROGRESS -> ANSWERED`: 답변 제출 성공
4. `IN_PROGRESS -> HINT_VIEWED`: 힌트 요청 성공
5. `IN_PROGRESS -> EXPLAINED`: 해설 요청 성공
6. `IN_PROGRESS -> SKIPPED`: 스킵 선택
7. `ANSWERED|EXPLAINED|SKIPPED -> COMPLETED`: 마지막 턴 처리 완료
8. `ANY -> FAILED`: GitHub/LLM/DB 오류 발생

분기별 초안 생성 모드:
- `ANSWERED 중심`: 구현 내용 + 설계 의도 + AI 피드백
- `EXPLAINED 중심`: 구현 내용 + 막힌 지점 + 학습 개념
- `SKIPPED 중심`: 커밋 요약/릴리즈노트

## 4) 모노레포 구조와 책임

```text
apps/
  client/   # React UI, 라우팅, 상태관리, API 클라이언트
  server/   # Express 라우트, 서비스, 외부 API 오케스트레이션
packages/
  shared/   # 공통 타입, Zod 스키마, API 계약 타입
docs/       # 요구사항, 체크리스트, 스킬/설계 문서
infra/      # docker-compose, 로컬 인프라 스크립트
```

책임 분리 원칙:
- `apps/client`: UI/UX와 사용자 상호작용에만 집중
- `apps/server`: 비즈니스 로직, 보안, 외부 API 통합 담당
- `packages/shared`: Client-Server 스키마 동기화 단일 소스
- `docs`: 의사결정 근거와 운영 규약 기록
- `infra`: 실행 환경 재현성 확보

## 5) MongoDB 컬렉션 초안 + 인덱스

컬렉션:
- `users`
  - `githubUserId`, `username`, `avatarUrl`, `createdAt`
- `interviewSessions`
  - `userId`, `repoFullName`, `commitSha`, `status`, `startedAt`, `completedAt`
- `interviewTurns`
  - `sessionId`, `turnIndex`, `question`, `expectedAnswer`, `hint`, `userAnswer`, `actionType`, `feedback`, `conceptTags`, `createdAt`
- `posts`
  - `userId`, `sessionId`, `repoFullName`, `commitSha`, `title`, `contentMarkdown`, `status(draft|published)`, `tags`, `createdAt`, `updatedAt`

필수 인덱스:
- `interviewSessions`: `{ userId: 1, createdAt: -1 }`
- `interviewTurns`: `{ sessionId: 1, turnIndex: 1 }` (unique)
- `posts`: `{ userId: 1, updatedAt: -1 }`

## 6) 설계 결정 메모
- 질문 생성 응답은 반드시 JSON 스키마 검증 후 저장한다.
- Diff가 과대하거나 빈 경우를 대비해 요약/폴백 질문 전략을 둔다.
- 상태 머신을 기준으로 UI 버튼 활성/비활성 규칙을 고정해 예외 흐름을 줄인다.
