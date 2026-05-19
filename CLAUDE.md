# commit-to-blog

GitHub 커밋 이력을 분석해 AI가 자동으로 개발 블로그 포스트를 생성하는 서비스.

## 프로젝트 개요

- **서비스명**: commit-to-blog
- **목적**: GitHub Repository의 커밋/브랜치를 선택 → LLM이 블로그 초안 생성 → 사용자가 편집 후 저장
- **테마**: Gruvbox (다크)
- **폰트**: 세리프 계열 (Georgia, 'Noto Serif KR')

## 기술 스택

| 영역 | 선택 | 이유 |
|------|------|------|
| Frontend | React + Vite | 빠른 개발환경, 컴포넌트 재사용 |
| Styling | CSS Modules + Gruvbox 변수 | 테마 일관성, 전역 CSS 변수 관리 용이 |
| Backend | Express.js | 수업 커리큘럼 기준, GitHub API 프록시에 적합 |
| LLM | OpenAI API (gpt-4o) | 한국어 지원 우수, 코드 분석 능력 |
| 저장소 | JSON 파일 (로컬) | MVP 단계 — DB 없이 빠르게 검증 |
| API 통신 | fetch (REST) | 외부 의존성 최소화 |

## 디렉토리 구조

```
commit-to-blog/
├── client/                  # React 프론트엔드
│   ├── src/
│   │   ├── components/
│   │   │   ├── PostList/    # 저장된 포스트 카드 목록
│   │   │   ├── PostEditor/  # AI 초안 편집기
│   │   │   ├── RepoSelector/ # GitHub 저장소/브랜치/커밋 선택
│   │   │   └── common/      # 공통 UI (Button, Card 등)
│   │   ├── pages/
│   │   │   ├── HomePage.jsx # 포스트 목록 페이지
│   │   │   └── EditorPage.jsx # 포스트 작성/편집 페이지
│   │   ├── hooks/           # 커스텀 훅
│   │   ├── api/             # fetch 래퍼 (서버 API 호출)
│   │   ├── styles/
│   │   │   └── gruvbox.css  # Gruvbox 색상 변수 정의
│   │   └── App.jsx
│   └── index.html
├── server/                  # Express 백엔드
│   ├── routes/
│   │   ├── github.js        # GitHub API 프록시
│   │   ├── posts.js         # 포스트 CRUD
│   │   └── llm.js           # LLM 요약 요청
│   ├── data/
│   │   └── posts.json       # 포스트 저장소
│   └── index.js
├── .env                     # GitHub token, OpenAI key (커밋 제외)
├── .env.example             # 환경변수 템플릿
├── CLAUDE.md
└── checklist.md             # 주차별 개발 체크리스트
```

## 환경변수

`.env` 파일에 보관, 절대 커밋하지 않는다.

```
GITHUB_TOKEN=ghp_...
OPENAI_API_KEY=sk-...
PORT=3001
```

## 데이터 구조

### Post (posts.json)

```json
{
  "id": "uuid",
  "title": "string",
  "content": "string (markdown)",
  "summary": "string (1~2줄 요약)",
  "repo": "owner/repo",
  "branch": "string",
  "commits": ["sha1", "sha2"],
  "tags": ["string"],
  "status": "draft | published",
  "createdAt": "ISO8601",
  "updatedAt": "ISO8601"
}
```

## Gruvbox 주요 색상

```css
--bg:       #282828;
--bg1:      #3c3836;
--fg:       #ebdbb2;
--yellow:   #d79921;
--orange:   #d65d0e;
--red:      #cc241d;
--green:    #98971a;
--blue:     #458588;
--purple:   #b16286;
--aqua:     #689d6a;
--gray:     #928374;
```

## 개발 원칙

- 컴포넌트는 단일 책임. 하나의 파일이 하나의 역할만 한다.
- API 키는 서버에서만 사용. 클라이언트에 절대 노출 금지.
- 체크리스트 항목 하나 완성 → 즉시 커밋.
- MVP 우선: 동작하는 것을 먼저, 꾸미는 것은 나중에.
