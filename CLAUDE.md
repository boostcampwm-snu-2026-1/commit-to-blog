# SMART BLOG — CLAUDE.md

GitHub 커밋을 AI가 블로그 포스트로 자동 변환하는 웹 애플리케이션.

## 기술 스택

- **Frontend**: React
- **Backend**: Node.js + Express
- **Database**: MongoDB
- **외부 API**: GitHub API, OpenAI API
- **환경변수**: `.env` — `GITHUB_TOKEN`, `OPENAI_API_KEY`

## 프로젝트 구조

```
commit-to-blog/
├── frontend/          # React 프론트엔드
└── backend/          # Express 백엔드
```

## 페이지 구성

| 경로 | 페이지 | 설명 |
|------|--------|------|
| `/write` | 글쓰기 | 저장소 검색 → 브랜치/커밋 선택 → AI 요약 → 포스트 저장 |
| `/blog` | 내 블로그 | 저장된 포스트 목록 |
| `/posts/:id` | 포스트 | 포스트 상세 |

설정 페이지는 없음.

## 컴포넌트 구조

```
App
└── Layout
    ├── Header (Logo, Nav, UserAvatar)
    └── [페이지]

WritePage
├── LeftPanel
│   ├── RepoSearch (SearchInput, SearchDropdown)
│   ├── BranchSelect
│   └── CommitList → CommitItem
└── RightPanel
    └── CommitDetail (CommitInfo, AISummary, ActionButtons)

BlogPage
├── PageHeader
└── PostGrid → PostCard / NewPostCard

PostPage
├── BackButton
├── PostTitle, PostMeta
└── PostContent
```

## API 엔드포인트

### GitHub 관련
```
GET  /api/github/repos?q={검색어}                              # 저장소 검색
GET  /api/github/repos/:owner/:repo/branches                   # 브랜치 목록
GET  /api/github/repos/:owner/:repo/commits?sha={브랜치}       # 커밋 목록
POST /api/github/repos/:owner/:repo/commits/:sha/summary       # AI 요약 생성
```

### 포스트 관련
```
GET   /api/posts          # 포스트 목록
GET   /api/posts/:id      # 포스트 상세
POST  /api/posts          # 포스트 저장
PATCH /api/posts/:id      # 포스트 수정
```

### 유저 관련
```
GET /api/user             # 프로필 사진, 계정명
```

## 데이터 구조

### Post (MongoDB 스키마)
```js
{
  title     : String,   // 커밋 메시지
  author    : String,   // 커밋한 사람
  date      : String,   // 커밋 일시
  branch    : String,   // 브랜치 이름
  summary   : String,   // AI 요약 내용
  createdAt : Date,     // 자동 생성
}
```

### GitHub에서 가져오는 데이터
- **저장소**: `name`, `full_name`
- **브랜치**: `name`
- **커밋**: `sha`, `message`, `author`, `date`, `patch` (상세 조회 시만)

### 유저
- `login`, `avatar_url`

## 상태 관리

### WritePage
```
selectedRepo → selectedBranch → commits[] → selectedCommit → summary
```
저장 완료 시 `/blog`로 이동.

### 전역 (Header)
앱 최초 진입 시 `GET /api/user` 호출 → `user` 상태로 모든 페이지에서 사용.

## 주요 구현 주의사항

**커밋 상세 별도 호출 필요**
커밋 목록(`GET /commits`)으로는 `patch`(코드 변경 내용)를 못 가져옴.
AI 요약 생성 시 반드시 `GET /commits/:sha`로 상세 조회 후 `patch` 추출.

**OpenAI 토큰 초과 방지**
`patch` 내용이 길면 토큰 초과 가능. Express에서 전송 전에 적절히 잘라서 보내야 함.

**중복 요청 방지**
로딩 중에는 버튼 비활성화 처리 필수 (AI 요약, 저장 등).

## 에러 처리 원칙

| 상황 | 처리 |
|------|------|
| 저장소 검색 결과 없음 | "일치하는 저장소가 없습니다." |
| 브랜치/커밋 fetch 실패 | "불러오지 못했습니다. 다시 시도해주세요." |
| GitHub 토큰 인증 실패 | "GitHub 연동에 문제가 있습니다." |
| AI 요약 생성 중 | 로딩 스피너 + 버튼 비활성화 |
| AI 요약 실패 | "요약 생성에 실패했습니다. 다시 시도해주세요." |
| 포스트 저장 실패 | "저장에 실패했습니다." + 페이지 이동 안 함 |
| 없는 포스트 접근 | "포스트를 찾을 수 없습니다." + `/blog`로 이동 |
