# 1주차 계획 (2026-05-17 ~ 2026-05-23)

## 목표

기획·설계를 끝내고 개발 환경을 세팅한다. GitHub API 연동까지 마쳐서, 2주차에는 LLM과 UI에만 집중할 수 있는 상태로 만든다.

---

## 결정된 스택과 이유

| 영역 | 선택 | 이유 |
|---|---|---|
| 프론트 | Vite + React + JavaScript | 가장 빠른 시작. TS는 학습 목표가 아님 |
| 스타일 | CSS Modules | 추가 라이브러리 0. 화면 2개 규모에 충분 |
| 에디터 | textarea + react-markdown | LLM 출력(마크다운)과 자연스럽게 연결, 가벼움 |
| 백엔드 | Express | GitHub/LLM 호출 프록시 + 토큰 보호 |
| 저장소 | 로컬 JSON 파일 (`server/data/posts.json`) | DB 없이 단순화, 학습 범위 외 |
| GitHub 인증 | Personal Access Token (`.env`) | OAuth는 학습 목표 외 |
| LLM 제공자 | 나중에 결정 (어댑터 추상화) | 결정 늦어져도 다른 작업 막히지 않게 |

---

## Scope

### MUST (반드시 한다)

1. `.env`에서 PAT 읽기 + `.gitignore`에 `.env` 추가
2. `GET /api/repos` — 내 저장소 목록
3. `GET /api/repos/:owner/:repo/branches` — 브랜치 목록
4. `GET /api/repos/:owner/:repo/commits?branch=` — 커밋 목록
5. `GET /api/repos/:owner/:repo/commits/:sha` — 커밋 상세(메시지·diff)
6. `POST /api/draft` — 선택 커밋 → 마크다운 초안 (LLM 어댑터, 처음엔 mock)
7. JSON 파일 read/write 유틸
8. `GET/POST/PUT/DELETE /api/posts` CRUD
9. Create Blog 화면 — 레포→브랜치→커밋→초안→에디터
10. Saved Posts 화면 — 카드 목록, 편집 진입
11. 발행 = `status: 'draft' | 'published'` 필드 토글
12. 로딩·에러 상태 UI
13. 글 삭제

### SHOULD (시간 남으면)

- 멀티 커밋 묶어서 초안 생성
- 저장 글 검색·브랜치 필터
- "다시 생성" 버튼
- 커밋 메시지/diff 길이 클리핑 (토큰 절약)

### WON'T (이번 2주에는 안 함)

- OAuth, DB, TypeScript
- 외부 블로그 발행 (Notion/Velog/Medium) — `status`로만 표현
- 스트리밍 LLM 응답, 사용자 계정, 배포
- 자동화 테스트, 다크모드, 이미지 업로드

---

## 데이터 구조

### GitHub 정규화 응답

```js
Repo   = { id, owner, name, fullName, defaultBranch, description, updatedAt, private }
Branch = { name, sha }
Commit = { sha, message, author: { name, date }, url }
CommitDetail = { sha, message, author, date,
                 files: [{ filename, status, additions, deletions, patch }] }
```

### 저장 객체 (posts.json)

```js
Post = {
  id: 'p_<timestamp>',
  title, content, summary,
  status: 'draft' | 'published',
  source: { owner, repo, branch, commitShas: [] },
  createdAt, updatedAt
}
```

### LLM 어댑터 계약

```js
// POST /api/draft
Request  = { owner, repo, branch, commitShas: [] }
Response = { title, content, summary }
```

`title` / `content` / `summary` 모두 LLM이 생성, 사용자는 에디터에서 수정.

---

## 디렉토리 구조

```
commit-to-blog/
├── client/                      # Vite + React
│   ├── vite.config.js           # /api 프록시 → localhost:3001
│   └── src/
│       ├── App.jsx              # 라우팅
│       ├── api.js               # fetch 래퍼
│       ├── pages/{CreateBlog, SavedPosts}.jsx
│       ├── components/{RepoSelector, BranchSelector, CommitList,
│       │                MarkdownEditor, PostCard, StatusBadge}.jsx
│       └── styles/*.module.css
├── server/                      # Express
│   ├── .env.example             # GITHUB_TOKEN= 만 명시
│   ├── index.js
│   ├── src/
│   │   ├── routes/{github, draft, posts}.js
│   │   ├── services/{github, llm}.js   # LLM은 mock부터
│   │   └── store/posts.js
│   └── data/posts.json          # commit 포함
├── docs/{week-1, week-2}.md
├── .env                         # gitignore
└── .gitignore
```

---

## 상태 흐름 (Create Blog)

```
RepoSelector → BranchSelector → CommitList → [초안 생성] → MarkdownEditor → [저장]
   GET /repos    GET /branches    GET /commits   POST /draft     POST /posts
```

상태는 React `useState` + props로 충분. 별도 상태관리 라이브러리 도입 X.

---

## 주요 인터랙션

- **레포/브랜치/커밋 선택**: 단계별로 다음 단계 활성화. 브랜치는 default 자동 선택.
- **커밋 멀티 선택**: 체크박스 + 선택 카운터. 1개 이상이면 "초안 생성" 활성화.
- **초안 생성**: 버튼 로딩 + 에디터 스켈레톤. 실패 시 "다시 시도" 노출.
- **에디터**: 좌 textarea / 우 react-markdown 미리보기. 하단 `[저장] [발행하기] [취소]`.
- **저장 후**: Saved Posts로 자동 이동 + 토스트.
- **카드 메뉴**: 편집 / 발행 토글 / 삭제(confirm 1회).
- **에러 배너**: PAT 오류, rate limit, 네트워크 실패 등은 친화적 메시지 + 재시도.

---

## 검증 시나리오 (수동 테스트 3개)

1. **Happy path** — 레포 → main → 커밋 1개 → 초안 → 수정 → 저장 → 카드 확인 → 재편집 → 발행
2. **멀티 커밋** — 커밋 3개 묶어서 초안 → 저장 → 카드에 모두 반영
3. **에러 친화성** — 잘못된 PAT / 없는 레포 / 네트워크 끊김 시 친화적 메시지

세 시나리오를 모두 통과하면 "완성".

---

## 1주차 개발 체크리스트

- [x] `.gitignore` 작성 (`.env`, `node_modules` 등)
- [x] `client/` Vite + React 스캐폴드
- [x] `server/` Express 스캐폴드 + `.env.example`
- [x] Vite dev 프록시 설정 (`/api` → `localhost:3001`)
- [x] `server/src/services/github.js` — fetch로 GitHub API 호출 + 정규화
- [x] `server/src/routes/github.js` — 4개 라우트 동작 확인 (curl로 에러 경로 검증 완료, happy path는 PAT 설정 후)
- [x] `server/src/store/posts.js` + `server/src/routes/posts.js` — CRUD 동작 확인 (전체 라이프사이클 + 에러 경로 curl 검증 완료)
- [x] 클라이언트 측 `api.js` fetch 래퍼 (GitHub 4개 + Posts 5개)
- [x] 최소 페이지 라우팅 (`/` Create, `/posts` Saved) — react-router-dom
- [x] `RepoSelector` / `BranchSelector` / `CommitList` 최소 동작 — 데이터가 화면에 보이기까지

---

## 미해결 / 다음 주에 결정

- LLM 제공자 (OpenAI / Anthropic / 기타)
- "나만의 Skill" 주제 — 개발 중 반복 패턴이 보이면 그때 패턴화
