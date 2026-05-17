# 1주차 계획 — 스마트블로그 서비스

> GitHub 활동 데이터 기반 AI 개발 블로그 생성 서비스

## 목표

1주차는 **기획 구체화 + 설계**에 집중. 코드는 거의 안 씀. 설계 문서를 확정해서 2주차에 바로 개발 들어갈 수 있게 만든다.

---

## 1. 사용자 시나리오

> 개발자가 1주일 동안 작업한 PR/커밋들을 회고하며 블로그로 남기고 싶을 때, GitHub repo와 브랜치를 고르고 커밋 몇 개를 체크하면 LLM이 초안을 만들어준다. 사용자는 초안을 다듬고 저장/발행한다.

**페르소나**: 주니어~미드 개발자, 블로그를 쓰고 싶지만 매번 처음부터 쓰기가 부담스러운 사람.

---

## 2. 구현 Scope

### Must (1~2주 안에 반드시)
- GitHub 로그인 (PAT 입력 방식으로 시작)
- 내 repo 리스트 조회
- repo 선택 → 브랜치 리스트 조회
- 브랜치 선택 → 커밋 리스트 조회
- 커밋 다중 선택 → LLM으로 블로그 초안 생성
- 초안 편집 (마크다운 에디터)
- 포스트 저장
- 저장된 포스트 목록 (카드형)
- 포스트 재편집

### Should (시간 되면)
- 커밋 diff까지 LLM에 전달해서 더 풍부한 초안
- 포스트 발행 (공개/비공개 토글)
- 태그 자동 추출

### Could (욕심)
- GitHub OAuth 로그인
- 다중 사용자
- 마크다운 미리보기

---

## 3. 기술 스택 + 선택 근거

| 영역 | 선택 | 이유 |
|---|---|---|
| 프론트 빌드 | Vite + React | 학습 키워드에 React 포함, Vite는 가장 빠른 설정 |
| 스타일링 | Tailwind CSS | 빠른 프로토타이핑, 디자인 시스템 부담 X |
| 상태 관리 | React Context + useState | scope가 작아서 Redux/Zustand 오버킬 |
| 서버 | Express | 학습 키워드 명시, GitHub/OpenAI 토큰 보호용 BFF |
| GitHub API | REST (octokit) | GraphQL보다 학습 곡선 완만, repo/branch/commit 조회에 충분 |
| LLM | OpenAI API (gpt-4o-mini) | 학습 키워드, 비용 저렴 |
| 데이터 저장 | 1주차: JSON 파일 / 2주차 여유되면 SQLite | DB 셋업에 시간 쓰지 말고 핵심에 집중 |
| 환경변수 | dotenv | 토큰 안전 관리 (.env, .gitignore) |
| HTTP 클라이언트 | fetch | 학습 키워드, 별도 라이브러리 불필요 |

---

## 4. 데이터 구조

```ts
// Post
{
  id: string,           // uuid
  title: string,
  content: string,      // markdown
  summary: string,      // 카드 미리보기용
  repoName: string,     // "owner/repo"
  branch: string,
  commitShas: string[], // 소스 커밋들
  createdAt: string,
  updatedAt: string,
  published: boolean
}

// Repository (캐시 안 함, 호출 시마다 fetch)
{ id, name, fullName, defaultBranch, private }

// Branch
{ name, commitSha }

// Commit
{ sha, message, author, date, url }
```

---

## 5. API 설계 (Express)

| Method | Path | 설명 |
|---|---|---|
| GET | `/api/repos` | 내 repo 리스트 |
| GET | `/api/repos/:owner/:repo/branches` | 브랜치 리스트 |
| GET | `/api/repos/:owner/:repo/commits?branch=` | 커밋 리스트 |
| POST | `/api/generate` | 커밋 정보 → LLM → 초안 반환 |
| GET | `/api/posts` | 저장된 포스트 전체 |
| GET | `/api/posts/:id` | 단일 포스트 |
| POST | `/api/posts` | 포스트 생성 |
| PUT | `/api/posts/:id` | 포스트 수정 |
| DELETE | `/api/posts/:id` | 포스트 삭제 |

GitHub 토큰은 서버 `.env`에 저장. 클라이언트는 토큰 모름.

---

## 6. 디렉토리 구조

```
smart-blog/
├── client/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── PostList.jsx       # 저장된 포스트 카드 목록
│   │   │   └── PostEditor.jsx     # 생성/편집 화면
│   │   ├── components/
│   │   │   ├── RepoSelector.jsx
│   │   │   ├── BranchSelector.jsx
│   │   │   ├── CommitList.jsx     # 다중 선택
│   │   │   ├── MarkdownEditor.jsx
│   │   │   └── PostCard.jsx
│   │   ├── api/
│   │   │   └── client.js          # fetch 래퍼
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── server/
│   ├── src/
│   │   ├── routes/
│   │   │   ├── repos.js
│   │   │   ├── generate.js
│   │   │   └── posts.js
│   │   ├── services/
│   │   │   ├── github.js          # octokit 호출
│   │   │   ├── openai.js          # LLM 호출 + 프롬프트
│   │   │   └── storage.js         # JSON 파일 read/write
│   │   ├── middleware/
│   │   │   └── errorHandler.js
│   │   └── index.js
│   ├── data/
│   │   └── posts.json
│   ├── .env                       # gitignore
│   └── package.json
│
├── docs/
│   ├── week1-plan.md              # 이 문서
│   └── week2-plan.md              # 2주차 작성 예정
│
└── README.md
```

---

## 7. 상태 흐름 (포스트 생성)

```
[사용자] repo 선택
  → client가 GET /api/repos 호출
  → server가 GitHub API 호출 (토큰 사용)
  → client에 repo 리스트 반환
  → RepoSelector state 업데이트

[사용자] 브랜치 선택
  → GET /api/repos/:owner/:repo/branches
  → BranchSelector state 업데이트

[사용자] 커밋 다중 선택 → "생성" 클릭
  → POST /api/generate { repo, branch, commitShas }
  → server가 커밋 메시지 + diff 수집
  → OpenAI 호출 (system prompt + 커밋 정보)
  → 마크다운 초안 반환
  → MarkdownEditor에 주입

[사용자] 편집 후 "저장"
  → POST /api/posts
  → storage.js가 JSON 파일에 append
  → PostList로 이동
```

---

## 8. 핵심 인터랙션

- **로딩 상태**: GitHub API / LLM 호출은 느림 → 모든 비동기 액션에 로딩 인디케이터 필수
- **에러 처리**: 토큰 만료, rate limit, LLM 실패 → 사용자에게 메시지 표시
- **커밋 다중 선택**: 체크박스 + 전체 선택 토글
- **에디터**: 초안 생성 후에도 사용자가 자유롭게 수정 가능, 저장 전 변경사항 경고
- **빈 상태**: 저장된 포스트 없을 때 안내 메시지

---

## 9. 검증 / "완료" 기준

- 로그인 토큰 입력 → repo 리스트가 5초 안에 뜨면 OK
- 커밋 3개 선택 → LLM 호출 → 30초 안에 초안이 에디터에 나타나면 OK
- 초안 편집 → 저장 → 새로고침 후에도 목록에 남아있으면 OK
- 토큰을 `.env`에서 빼고 실행 → 명확한 에러 메시지 나오면 OK
- 클라이언트 네트워크 탭에 GitHub/OpenAI 토큰 안 보이면 OK

---

## 10. AI Workflow (초안)

1. **계획 단계**: Claude에게 기능 단위로 요구사항 던지고, 데이터 흐름 / 엣지 케이스를 같이 정리
2. **개발 단계**: 컴포넌트/엔드포인트 하나 단위로 Claude/Cursor에 위임, 작은 단위로 검증
3. **검증 단계**: 작성된 코드를 직접 읽고 이해 못 하는 부분은 다시 설명 요청 — "그냥 돌아가니까 패스"는 금지
4. **회고 단계**: 반복되는 좋은 패턴 발견 시 메모 → 2주차에 Skill로 패턴화

**Skill 후보 (관찰 중)**
- GitHub API 응답 → 우리 데이터 구조로 매핑하는 패턴
- LLM 프롬프트 템플릿 (커밋 → 블로그 초안)

---

## 11. 1주차 일정

| 일 | 할 일 |
|---|---|
| 월 | 시나리오 / Scope 확정, 도구 선택 마무리 |
| 화 | 데이터 구조 + API 명세 작성 |
| 수 | 디렉토리 구조 + 상태 흐름 다이어그램 |
| 목 | 핵심 인터랙션 / 검증 기준 정리 |
| 금 | AI workflow 정리, 문서 커밋, repo 초기화 (보일러플레이트만) |

---

## 12. 리스크 & 대응

| 리스크 | 대응 |
|---|---|
| LLM 응답이 너무 길거나 짧음 | 프롬프트에 길이/포맷 명시, 예시 첨부 |
| GitHub API rate limit | 캐싱 고려, 인증 요청은 5000/h라 1주차엔 OK |
| commit diff 너무 큼 | 길이 제한 + 요약 후 전달 |
| 토큰 노출 | 서버에서만 처리, .env는 .gitignore 확인 |
