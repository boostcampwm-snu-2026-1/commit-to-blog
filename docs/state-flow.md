# 상태 흐름 (State Flow)

> 데이터/상태가 어느 컴포넌트·API 를 타고 흐르는지. (PDF: "어떤 상태가 어떤 구조를 타고 이동하는가?")

---

## 1. 클라이언트 상태 4가지

| 분류 | 예시 | 보관 위치 |
|---|---|---|
| 서버 데이터 (캐시) | 저장소 목록, 브랜치, 커밋, 저장된 포스트 | **React Query** (`@tanstack/react-query`) |
| UI 입력값 | 검색어, 편집기 텍스트, 선택된 sha 목록 | 해당 컴포넌트의 `useState` |
| URL 상태 | 현재 라우트, `:id` 같은 파라미터 | **React Router** |
| 일시적 알림 | 토스트, 모달 open/close | 가까운 부모의 `useState` (전역 불필요) |

서버 데이터를 `useState` 로 들고 다니지 않는 이유:
- 캐시/로딩/에러/재시도/탭간 동기화 모두 React Query 가 해결.
- 같은 데이터를 여러 화면이 동시에 보면 stale 처리가 자동.

---

## 2. 화면별 상태 다이어그램

### 2.1 `CreatePostPage` (`/create`)

```
사용자 입력 (검색어)                                    [useState: query]
   │ 300ms debounce
   ▼
useRepos(query)  ── React Query ── api/repos.ts ── GET /api/repos?q=…
   │ data
   ▼
RepoSearchInput.tsx     ─── 사용자 선택 ───▶ [useState: selectedRepo]
                                                       │
                                                       ▼
                                              useBranches(repo)  ── GET /api/repos/:owner/:repo/branches
                                                       │
                                                       ▼
                                       BranchSelect.tsx ─── [useState: selectedBranch]
                                                       │
                                                       ▼
                                              useCommits(repo, branch) ── GET /api/repos/:owner/:repo/commits
                                                       │
                                                       ▼
                                              CommitPicker.tsx ── [useState: selectedShas]
                                                       │
                                                       ▼ "요약 생성" 클릭
                                          useGenerateDraft 뮤테이션 ── POST /api/posts/draft
                                                       │ data
                                                       ▼
                                              AiSummaryPanel.tsx ── [useState: editedBody]
                                                       │
                                                       ▼ "저장 및 게시" 클릭
                                          usePosts.create 뮤테이션 ── POST /api/posts
                                                       │
                                                       ▼
                                          React Router → navigate("/")
```

**핵심 포인트**
- `selectedRepo`, `selectedBranch`, `selectedShas` 는 **CreatePostPage 의 로컬 state**. 페이지를 떠나면 사라진다.
- 서버 응답은 React Query 캐시에 남아, 같은 페이지로 돌아오면 즉시 표시 + 백그라운드 refetch.

### 2.2 `SavedPostsPage` (`/`)

```
usePosts.list ── React Query ── GET /api/posts
   │ data
   ▼
PostCard.tsx (N개)
   ├── "수정하기" ──▶ navigate("/posts/:id/edit")
   └── "발행하기" ──▶ usePosts.publish 뮤테이션 ── PATCH /api/posts/:id/publish
                              │
                              └─ invalidate(["posts"]) → 자동 refetch
```

### 2.3 `EditPostPage` (`/posts/:id/edit`)

```
useParams() → id
   │
   ▼
usePosts.get(id) ── GET /api/posts/:id
   │ data
   ▼
PostEditor.tsx
   └── [useState: body, title]   ← 사용자 편집
              │ "저장" 클릭
              ▼
   usePosts.update 뮤테이션 ── PUT /api/posts/:id
              │
              └ navigate("/")
```

---

## 3. 서버 상태 흐름

### 3.1 요청 처리 일반 형태

```
HTTP 요청
   │
   ▼
middlewares.requestLogger
   │
   ▼
routes/<domain>.ts   ── Zod 입력 검증
   │
   ▼
services/<domain>/*  ── 외부 API 또는 in-memory 조작
   │
   ▼
응답 객체로 변환 (shared 타입)
   │
   ▼
res.json(...)
   │
   ▼
middlewares.errorHandler  (에러 발생 시 catch)
```

### 3.2 LLM 호출 시 데이터 흐름 (12주차 영역, 인터페이스만 11주차에)

```
POST /api/posts/draft  { repo, branch, shas }
   │
   ▼
routes/drafts.ts   (Zod 검증)
   │
   ▼
github.getCommitsWithDiff(repo, shas)
   │
   ▼
llm.createDraft({ repo, commits, diffs })
   │   ├─ prompts.blogDraft (시스템 프롬프트)
   │   ├─ 사용자 메시지 = 직렬화된 커밋 + diff
   │   └─ openai.chat.completions.create
   ▼
{ title, body, summary, generatedAt, model, contextKey }
   │
   ▼
res.json(draft)
```

`contextKey` 가 같으면 in-memory LRU 캐시에서 즉시 반환 (Should 항목 S4).

---

## 4. 상태 일관성 규칙

1. **서버가 진실의 원천**. 클라이언트는 캐시만 들고 있다.
2. 변경 발생 시 (`mutation` 성공) → 관련 쿼리 키를 `invalidate` 해 자동 refetch.
3. 사용자가 페이지를 새로고침해도 동일한 데이터를 본다 (`data/posts.json` 에서 복원).
4. 발행 토글은 낙관적 업데이트 없이 동기 처리 (사용자가 누른 결과를 다시 확인할 수 있어야 함).

---

## 5. 12주차에 다시 볼 결정

- LLM 응답을 streaming 으로 받을지 → React Query 의 `streamedQuery` 또는 SSE 도입 여부.
- 같은 화면을 여러 탭에서 열었을 때 동기화 (BroadcastChannel) — 가능성 낮음, 굳이 안 함.
- 큰 diff 보내는 경우 토큰 관리 — `services/github/getDiff.ts` 에서 hunk 우선순위 결정.
