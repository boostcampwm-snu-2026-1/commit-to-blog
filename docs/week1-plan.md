# 1주차 계획

## 목표

1주차 끝에 **동작하는 얇은 end-to-end** 완성:
커밋 선택 → AI 요약 → 화면 표시.

## 참고 문서

- 전체 디자인 / 결정 사항 / 데이터 모델 / API 계약: [docs/superpowers/specs/2026-05-18-smart-blog-design.md](../docs/superpowers/specs/2026-05-18-smart-blog-design.md)
- 본 파일은 design spec 8절의 1주차 부분을 미러링한다. spec과 불일치 발생 시 spec을 우선하고 본 파일을 갱신한다.
- **2026-05-19 LLM 전환:** Anthropic Claude → Google Gemini. 아래 "Claude 연동" 섹션의 commit 라벨은 전환 전 실제 commit 메시지를 보존한다. 전환 작업은 별도 commit으로 추가된다.

## 체크리스트 (각 항목 = 1 commit)

### 프로젝트 셋업
- [x] `chore: init npm workspaces (client, server, shared) + .gitignore + .env.example`
- [x] `chore: scaffold Vite React TS in client/`
- [x] `chore: scaffold Express TS in server/ with /api/health`
- [x] `chore: add tailwind to client/`
- [x] `chore: add shared/types.ts with RepoSummary/CommitSummary/Draft`
- [x] `docs: add week1-plan.md and week2-plan.md`

### GitHub 연동 (서버)
- [ ] `feat(server): env.ts loads GITHUB_TOKEN/ANTHROPIC_API_KEY with zod validation`
- [ ] `feat(server): githubClient.listRepos() with Octokit`
- [ ] `feat(server): GET /api/github/repos endpoint`
- [ ] `feat(server): githubClient.listBranches() + GET /api/github/branches`
- [ ] `feat(server): githubClient.listCommits() + GET /api/github/commits`
- [ ] `test(server): integration tests for /api/github/* with mocked Octokit`

### Claude 연동 + 드래프트 생성 (서버)
- [ ] `feat(server): claudeClient.complete() with Anthropic SDK`
- [ ] `feat(server): prompts/blogDraftPrompt.ts template`
- [ ] `feat(server): draftStore.ts Map-based memory store`
- [ ] `feat(server): POST /api/drafts/generate (commit → LLM → store)`
- [ ] `feat(server): GET /api/drafts, GET /api/drafts/:id`
- [ ] `test(server): draftStore CRUD + generate route with mocked Claude`

### 프론트 골격 + 데이터 페치
- [ ] `feat(client): Header with tabs (My Blog / Saved Posts / Settings)`
- [ ] `feat(client): React Query setup + lib/api.ts fetch wrapper`
- [ ] `feat(client): useRepos + RepoSearchInput component`
- [ ] `feat(client): useBranches + BranchSelect component`
- [ ] `feat(client): useCommits + CommitList/CommitListItem components`

### 얇은 end-to-end 완주
- [ ] `feat(client): useGenerateDraft mutation + "요약 생성" button wired`
- [ ] `feat(client): AISummaryPanel renders generated draft`
- [ ] `feat(client): MyBlogPage layout matches mockup`
- [ ] `chore: README with run instructions + screenshots`

## 마일스톤

🎯 커밋 선택 → AI 요약 → 화면 표시까지 동작.

## 진행 노트

(작업 세션마다 갱신)

| 날짜 | 진행 | 비고 |
|---|---|---|
| 2026-05-18 | 프로젝트 셋업 6항목 완료 (workspaces / vite / express / tailwind / shared types / plan files) | 다음: GitHub 연동 시작 |

## 회고 메모 (PR 작성용)

- **분석·설계 과정:** _작성 예정_
- **가장 막혔던 순간:** _작성 예정_
- **새로 알게 된 것:** _작성 예정_
- **다르게 한다면:** _작성 예정_
