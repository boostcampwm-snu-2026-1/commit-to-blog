# 프로젝트 구조 설명서

> commit-to-blog — GitHub 활동을 LLM으로 블로그화하는 서비스의 전체 구조.
> 주차별 상세 일정은 [week1-plan.md](week1-plan.md) 참고.

---

## 1. 한 줄 요약

**클라이언트(React)** 가 **서버(Express BFF)** 에게 요청하고, 서버가 **GitHub API**와 **OpenAI API**를 호출해서 결과를 돌려준다. 토큰은 서버에만 있다.

---

## 2. 전체 아키텍처

```
┌─────────────┐    /api/*    ┌──────────────┐    REST    ┌────────────┐
│   Browser   │ ───────────▶ │   Express    │ ─────────▶ │  GitHub    │
│  (React +   │              │   (BFF)      │            │   API      │
│   Tailwind) │ ◀─────────── │              │            └────────────┘
└─────────────┘   JSON       │              │            ┌────────────┐
                             │              │ ─────────▶ │  OpenAI    │
                             │              │            │   API      │
                             │              │            └────────────┘
                             │              │
                             │              │  read/write
                             │              │ ─────────▶ posts.json
                             └──────────────┘
```

**왜 BFF(Backend For Frontend) 인가**
- GitHub / OpenAI 토큰을 브라우저에 노출하면 안 됨
- 서버가 토큰을 들고 있고, 클라는 서버한테만 요청
- 클라 → `/api/repos` 호출 시 토큰 없이 보냄. 서버가 `.env`의 토큰으로 GitHub 호출

---

## 3. 디렉토리 한 줄 설명

```
commit-to-blog/
├── client/                   React 앱 (포트 5173)
│   ├── index.html            Vite 진입점
│   ├── vite.config.js        /api → :4000 프록시 설정
│   ├── tailwind.config.js
│   └── src/
│       ├── main.jsx          React 마운트
│       ├── App.jsx           라우터 (예정)
│       ├── pages/            화면 단위 (PostList, PostEditor)
│       ├── components/       재사용 UI (RepoSelector, CommitList 등)
│       └── api/client.js     fetch 래퍼 (서버 호출 한 곳에 모음)
│
├── server/                   Express BFF (포트 4000)
│   ├── src/
│   │   ├── index.js          앱 부팅 + 라우터 마운트
│   │   ├── routes/           HTTP 경로 정의 (얇게)
│   │   │   ├── repos.js      GitHub 관련 GET
│   │   │   ├── generate.js   LLM 호출
│   │   │   └── posts.js      포스트 CRUD
│   │   ├── services/         실제 로직 (외부 API, 저장소)
│   │   │   ├── github.js     octokit 래핑
│   │   │   ├── openai.js     LLM 호출 + 프롬프트
│   │   │   └── storage.js    posts.json read/write
│   │   └── middleware/
│   │       └── errorHandler.js
│   ├── data/posts.json       1주차 임시 저장소 (gitignore)
│   └── .env                  토큰 (gitignore)
│
├── docs/
│   ├── plan.md               ← 이 문서 (구조 설명)
│   └── week1-plan.md         1주차 상세 일정
│
├── package.json              루트 — concurrently로 client+server 동시 실행
├── CHECKLIST.md              주차별 진행 체크리스트
├── CLAUDE.md                 AI 협업 가이드
└── README.md
```

---

## 4. 레이어 책임 분담

| 레이어 | 책임 | 하지 않는 것 |
|---|---|---|
| `pages/` | 화면 조립, 라우팅 진입 | 직접 fetch 호출 ❌ |
| `components/` | UI + 로컬 상태 | API 호출 ❌ (props로 받음) |
| `api/client.js` | 서버 호출 한 곳에 모음 | UI 로직 ❌ |
| `routes/` | HTTP 진입/출구, 입력 검증 | 비즈니스 로직 ❌ |
| `services/` | 외부 API, 파일 I/O, 프롬프트 | HTTP 응답 형식 ❌ |
| `middleware/` | 에러 핸들링, 로깅 | 라우트별 로직 ❌ |

**규칙: 라우트는 얇게, 서비스는 두껍게.** 라우트는 "받아서 → 서비스 호출 → 응답"만. 모킹/테스트하기 좋아짐.

---

## 5. 데이터 흐름 (포스트 생성 예시)

```
[브라우저]                    [서버]                       [외부]
  │                             │                            │
  │ ① RepoSelector 클릭         │                            │
  │ GET /api/repos              │                            │
  ├────────────────────────────▶│ services/github.js         │
  │                             ├──────────────────────────▶ │ GitHub API
  │                             │◀────────────────────────── │
  │◀────────────────────────────│ [{name, fullName, ...}]    │
  │                             │                            │
  │ ② Branch / Commit 선택      │                            │
  │ (위와 동일 패턴 반복)        │                            │
  │                             │                            │
  │ ③ "생성" 버튼               │                            │
  │ POST /api/generate          │                            │
  │ {repo, branch, shas[]}      │                            │
  ├────────────────────────────▶│ services/github.js         │
  │                             │   .getCommitDetails(shas)  │
  │                             ├──────────────────────────▶ │ GitHub
  │                             │◀────────────────────────── │
  │                             │ services/openai.js         │
  │                             │   .generateDraft(commits)  │
  │                             ├──────────────────────────▶ │ OpenAI
  │                             │◀────────────────────────── │
  │◀────────────────────────────│ {title, content, summary}  │
  │                             │                            │
  │ ④ 에디터에서 수정 후 저장    │                            │
  │ POST /api/posts {...}       │                            │
  ├────────────────────────────▶│ services/storage.js        │
  │                             │   .savePost(post)          │
  │                             │       └─ posts.json 갱신   │
  │◀────────────────────────────│ {id, ...}                  │
```

---

## 6. 환경변수 / 비밀 관리

| 변수 | 위치 | 누가 씀 |
|---|---|---|
| `GITHUB_TOKEN` | `server/.env` | `services/github.js` |
| `OPENAI_API_KEY` | `server/.env` | `services/openai.js` |
| `PORT` | `server/.env` | `server/src/index.js` |

- `.env`는 `.gitignore`에 포함. 커밋되면 안 됨.
- 새 환경 셋업 시 `.env.example`을 복사해서 채움.
- **클라이언트는 토큰을 절대 모른다.** 네트워크 탭에서 토큰이 보이면 버그.

---

## 7. 외부 의존성

| 의존성 | 어디서 씀 | 이유 |
|---|---|---|
| `react`, `react-dom` | client | UI |
| `vite`, `@vitejs/plugin-react` | client | 빌드/dev 서버 |
| `tailwindcss`, `postcss`, `autoprefixer` | client | 스타일링 |
| `express` | server | HTTP 서버 |
| `dotenv` | server | `.env` 로드 |
| `@octokit/rest` | server (예정) | GitHub API |
| `openai` 또는 `fetch` | server (예정) | LLM 호출 |
| `uuid` | server (예정) | 포스트 ID |
| `concurrently` | 루트 | client + server 동시 실행 |

---

## 8. 실행 모델

| 명령 | 동작 |
|---|---|
| `npm run dev` | 루트에서 concurrently로 client(5173) + server(4000) 동시 기동 |
| `npm run dev:client` | Vite 단독 |
| `npm run dev:server` | `node --watch` 단독 |

Vite 설정에서 `/api/*`는 `http://localhost:4000`으로 프록시되므로, 클라 코드에서는 `fetch('/api/repos')`처럼 상대경로로 호출하면 됨. CORS 설정 불필요.

---

## 9. 확장 지점 (2주차 이후)

| 지금 | 나중에 |
|---|---|
| PAT 직접 입력 | GitHub OAuth |
| `posts.json` 파일 | SQLite / Postgres |
| 단일 사용자 | 다중 사용자 + 세션 |
| `<textarea>` 에디터 | 마크다운 라이브 프리뷰 |
| OpenAI만 | Claude / 로컬 LLM 옵션 |

**원칙**: 지금 만들지 않는다. `services/` 인터페이스만 안정적으로 두면 교체 비용은 작다.

---

## 10. 작업할 때 기억할 것

1. **새 기능은 services → routes → client 순으로 만든다.** 서버 단독 검증 (`curl`) → 프론트 연결.
2. **라우트 추가 시 [week1-plan.md](week1-plan.md) §5 API 표 업데이트.**
3. **데이터 구조 변경 시 §4 동기화.**
4. **반복 패턴 발견 시 [CHECKLIST.md](../CHECKLIST.md)의 Skill 후보에 메모.** Skill은 패턴이 2~3번 반복된 뒤 만든다.
