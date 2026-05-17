# 데이터 모델 (Data Model)

> "어떤 데이터가 필요할까?" — 화면/기획서를 토대로 도출한다. (PDF 가이드 항목)
> 정의된 타입은 `packages/shared/src/types/` 에 둔다 (12주차에 생성, 11주차에는 형식만 합의).

---

## 도메인 엔티티 4개

```
Repo ─┐
      ├── Commit (선택된 1..N)
Branch┘            │
                   ▼
              Draft (LLM 응답)
                   │
                   ▼
                  Post (저장된 글)
```

---

## 1. Repo

GitHub 저장소 1개를 가리킨다.

```ts
type Repo = {
  /** GitHub global node ID (GraphQL) */
  id: string;
  /** "owner/name" 형식 */
  fullName: string;
  /** UI에 표시할 이름 */
  name: string;
  owner: { login: string; avatarUrl: string };
  defaultBranch: string;
  description: string | null;
  /** UTC ISO 8601 */
  updatedAt: string;
};
```

**왜 이 필드인가**
- `fullName` — 모든 후속 API 호출의 키 (`/repos/:owner/:repo`)
- `defaultBranch` — 브랜치 picker 의 기본 선택값
- `avatarUrl` — 카드 헤더에 표시
- `description`, `updatedAt` — 카드 보조 정보 (PDF 예시 화면 참조)

## 2. Branch

```ts
type Branch = {
  name: string;
  isDefault: boolean;
  /** 가장 최근 커밋 sha */
  headSha: string;
};
```

## 3. Commit

```ts
type Commit = {
  /** 7자 단축 sha (UI), 그리고 풀 sha */
  sha: string;
  shortSha: string;
  message: string;
  author: { name: string; login: string | null; avatarUrl: string | null };
  /** ISO 8601 UTC */
  committedAt: string;
  /** 변경된 파일 수 (요약 표시용) */
  changedFiles?: number;
};
```

`changedFiles` 는 GraphQL `history` 노드에는 없고 REST `getCommit` 에 있음 → 카드 표시 시 추가 호출 비용 vs 정보 풍부도 트레이드오프. 기본은 미포함, 카드 펼침 시 lazy fetch.

## 4. Draft (LLM 응답 — 저장 전 상태)

```ts
type Draft = {
  /** 입력 컨텍스트 (재생성 시 동일하면 캐시 히트) */
  contextKey: string;
  repoFullName: string;
  branch: string;
  commitShas: string[];
  /** LLM 이 만든 본문 (마크다운) */
  body: string;
  /** LLM 이 만든 제목 */
  title: string;
  /** LLM 이 만든 한 줄 요약 (카드 미리보기용) */
  summary: string;
  /** UTC ISO 8601 */
  generatedAt: string;
  /** 사용한 모델 식별자 */
  model: string;
};
```

`contextKey` 는 `sha256(repoFullName + branch + sortedShas.join(",") + model)` 로 만든다.

## 5. Post (저장된 글)

```ts
type PostStatus = "draft" | "published";

type Post = {
  /** uuid v4 */
  id: string;
  title: string;
  /** 마크다운 본문 */
  body: string;
  /** 카드 미리보기 */
  summary: string;
  /** 사용자가 어디서 뽑아왔는지 추적 */
  source: {
    repoFullName: string;
    branch: string;
    commitShas: string[];
  };
  status: PostStatus;
  /** UTC ISO 8601 */
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
};
```

---

## 저장 위치

### in-memory

- `apps/server/src/db/postsRepository.ts` 가 `Map<string, Post>` 를 들고 있음.
- 서버 시작 시 `data/posts.json` 에서 로드, 변경 시 `data/posts.json` 으로 동기화 (debounce 200ms).
- 동시성: 단일 프로세스 가정. 큐 / lock 없음.

### `data/posts.json` 영속화 형식

```json
{
  "version": 1,
  "posts": [
    {
      "id": "…",
      "title": "…",
      "body": "…",
      "summary": "…",
      "source": { "repoFullName": "jj1kim/foo", "branch": "main", "commitShas": ["abc1234"] },
      "status": "draft",
      "createdAt": "2026-05-20T03:00:00.000Z",
      "updatedAt": "2026-05-20T03:00:00.000Z",
      "publishedAt": null
    }
  ]
}
```

`version` 필드 두는 이유: 12주차에 스키마가 바뀌면 마이그레이션 로직을 끼울 자리.

---

## 12주차에 결정할 것들

- `Post.tags: string[]` 도입 여부 (Should 항목)
- `Draft` 를 별도 저장할지 (현재는 `Post` 직전 상태로만 들고 있음)
- diff truncation 정책 → `Draft.contextKey` 안에 truncate 버전도 포함시킬지
