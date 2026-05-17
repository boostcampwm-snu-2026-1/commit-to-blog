import type { BranchSummary, CommitDetail, CommitSummary, RepositorySummary } from "../../types.js";

const demoRepositories: RepositorySummary[] = [
  {
    owner: "donghyun",
    name: "commit-to-blog",
    fullName: "donghyun/commit-to-blog",
    description: "GitHub 활동을 개발 블로그 초안으로 바꾸는 AI 서비스",
    defaultBranch: "main",
    updatedAt: "2026-05-15T03:20:00.000Z",
    isPrivate: false
  },
  {
    owner: "donghyun",
    name: "ui-lab",
    fullName: "donghyun/ui-lab",
    description: "대시보드와 카드 UI 실험용 저장소",
    defaultBranch: "main",
    updatedAt: "2026-05-12T14:05:00.000Z",
    isPrivate: false
  }
];

const branchesByRepository: Record<string, BranchSummary[]> = {
  "donghyun/commit-to-blog": [
    { name: "main", protected: true, commitSha: "1e4a4cf" },
    { name: "feature/blog-generator", protected: false, commitSha: "a84f92d" }
  ],
  "donghyun/ui-lab": [
    { name: "main", protected: true, commitSha: "8f10ee1" },
    { name: "feature/editorial-cards", protected: false, commitSha: "b77fd20" }
  ]
};

const commitsByBranch: Record<string, CommitSummary[]> = {
  "donghyun/commit-to-blog::feature/blog-generator": [
    {
      sha: "a84f92d",
      message: "style: redesign saved posts card layout",
      authorName: "Donghyun",
      committedAt: "2026-05-15T02:52:00.000Z",
      url: "https://github.com/donghyun/commit-to-blog/commit/a84f92d"
    },
    {
      sha: "73b8c21",
      message: "feat: summarize commit diff into blog draft",
      authorName: "Donghyun",
      committedAt: "2026-05-15T02:10:00.000Z",
      url: "https://github.com/donghyun/commit-to-blog/commit/73b8c21"
    },
    {
      sha: "d32af61",
      message: "feat: connect commit multi-select and draft form",
      authorName: "Donghyun",
      committedAt: "2026-05-14T19:42:00.000Z",
      url: "https://github.com/donghyun/commit-to-blog/commit/d32af61"
    },
    {
      sha: "9c1e4ab",
      message: "feat: add repository and branch picker",
      authorName: "Donghyun",
      committedAt: "2026-05-14T16:10:00.000Z",
      url: "https://github.com/donghyun/commit-to-blog/commit/9c1e4ab"
    }
  ],
  "donghyun/commit-to-blog::main": [
    {
      sha: "1e4a4cf",
      message: "chore: initialize project docs and scaffolding",
      authorName: "Donghyun",
      committedAt: "2026-05-13T09:30:00.000Z",
      url: "https://github.com/donghyun/commit-to-blog/commit/1e4a4cf"
    }
  ],
  "donghyun/ui-lab::feature/editorial-cards": [
    {
      sha: "b77fd20",
      message: "feat: build editorial metrics cards",
      authorName: "Donghyun",
      committedAt: "2026-05-12T14:05:00.000Z",
      url: "https://github.com/donghyun/ui-lab/commit/b77fd20"
    }
  ],
  "donghyun/ui-lab::main": [
    {
      sha: "8f10ee1",
      message: "chore: seed ui experiments",
      authorName: "Donghyun",
      committedAt: "2026-05-10T06:00:00.000Z",
      url: "https://github.com/donghyun/ui-lab/commit/8f10ee1"
    }
  ]
};

const commitDetailsBySha: Record<string, CommitDetail> = {
  "9c1e4ab": {
    sha: "9c1e4ab",
    message: "feat: add repository and branch picker",
    authorName: "Donghyun",
    committedAt: "2026-05-14T16:10:00.000Z",
    url: "https://github.com/donghyun/commit-to-blog/commit/9c1e4ab",
    body: "사용자가 저장소와 브랜치를 먼저 선택할 수 있는 흐름을 추가했다.",
    files: [
      {
        filename: "apps/web/src/pages/CreateBlogPage.tsx",
        status: "modified",
        additions: 38,
        deletions: 2,
        patch: "@@ -12,6 +12,24 @@\n+const [selectedRepo, setSelectedRepo] = useState('');\n+const [selectedBranch, setSelectedBranch] = useState('main');\n+\n+useEffect(() => {\n+  void fetchRepositories();\n+}, []);\n+\n+function handleRepositoryChange(fullName: string) {\n+  setSelectedRepo(fullName);\n+  setSelectedBranch('main');\n+}\n"
      },
      {
        filename: "apps/server/src/routes/github.routes.ts",
        status: "added",
        additions: 41,
        deletions: 0,
        patch: "@@ -0,0 +1,41 @@\n+router.get('/repositories', async (_req, res) => {\n+  const repositories = await listRepositories();\n+  res.json({ repositories });\n+});\n"
      }
    ]
  },
  "d32af61": {
    sha: "d32af61",
    message: "feat: connect commit multi-select and draft form",
    authorName: "Donghyun",
    committedAt: "2026-05-14T19:42:00.000Z",
    url: "https://github.com/donghyun/commit-to-blog/commit/d32af61",
    body: "여러 커밋을 선택해 한 번에 블로그 초안을 만들 수 있도록 연결했다.",
    files: [
      {
        filename: "apps/web/src/pages/CreateBlogPage.tsx",
        status: "modified",
        additions: 67,
        deletions: 11,
        patch: "@@ -88,6 +88,24 @@\n+function toggleCommit(sha: string) {\n+  setSelectedCommitShas((current) =>\n+    current.includes(sha)\n+      ? current.filter((item) => item !== sha)\n+      : [...current, sha]\n+  );\n+}\n"
      },
      {
        filename: "apps/server/src/modules/blog/blog.service.ts",
        status: "added",
        additions: 55,
        deletions: 0,
        patch: "@@ -0,0 +1,55 @@\n+export async function generateBlogDraft(input: GenerateBlogInput) {\n+  const commits = await Promise.all(input.commitShas.map((sha) => getCommitDetails(...)));\n+  return commits;\n+}\n"
      }
    ]
  },
  "73b8c21": {
    sha: "73b8c21",
    message: "feat: summarize commit diff into blog draft",
    authorName: "Donghyun",
    committedAt: "2026-05-15T02:10:00.000Z",
    url: "https://github.com/donghyun/commit-to-blog/commit/73b8c21",
    body: "커밋 메시지와 파일 변경 내용을 LLM 입력으로 가공해 글 초안을 만든다.",
    files: [
      {
        filename: "apps/server/src/modules/blog/blog.service.ts",
        status: "modified",
        additions: 92,
        deletions: 4,
        patch: "@@ -20,6 +20,31 @@\n+const prompt = buildPrompt({ repository, branch, commits });\n+const response = await openai.chat.completions.create({\n+  model,\n+  response_format: { type: 'json_object' },\n+  messages: [\n+    { role: 'system', content: SYSTEM_PROMPT },\n+    { role: 'user', content: prompt }\n+  ]\n+});\n"
      },
      {
        filename: "apps/server/src/modules/posts/posts.repository.ts",
        status: "modified",
        additions: 24,
        deletions: 0,
        patch: "@@ -1,5 +1,24 @@\n+insertPost({\n+  title,\n+  summary,\n+  content,\n+  generationMode: 'live'\n+});\n"
      }
    ]
  },
  "a84f92d": {
    sha: "a84f92d",
    message: "style: redesign saved posts card layout",
    authorName: "Donghyun",
    committedAt: "2026-05-15T02:52:00.000Z",
    url: "https://github.com/donghyun/commit-to-blog/commit/a84f92d",
    body: "저장된 글 목록을 카드형 레이아웃으로 바꾸고 상태 태그를 강화했다.",
    files: [
      {
        filename: "apps/web/src/pages/SavedPostsPage.tsx",
        status: "modified",
        additions: 46,
        deletions: 8,
        patch: "@@ -40,7 +40,22 @@\n+<article className=\"post-card\">\n+  <span className=\"post-card__branch\">{post.branch}</span>\n+  <span className={`post-card__status post-card__status--${post.status}`}>{post.status}</span>\n+  <p>{post.summary}</p>\n+</article>\n"
      },
      {
        filename: "apps/web/src/styles/global.css",
        status: "modified",
        additions: 58,
        deletions: 3,
        patch: "@@ -112,6 +112,34 @@\n+.post-card {\n+  border-radius: 24px;\n+  background: linear-gradient(180deg, rgba(255,255,255,0.92), rgba(247,244,238,0.96));\n+  box-shadow: 0 18px 50px rgba(38, 26, 17, 0.08);\n+}\n"
      }
    ]
  },
  "1e4a4cf": {
    sha: "1e4a4cf",
    message: "chore: initialize project docs and scaffolding",
    authorName: "Donghyun",
    committedAt: "2026-05-13T09:30:00.000Z",
    url: "https://github.com/donghyun/commit-to-blog/commit/1e4a4cf",
    body: "README 와 docs 초안을 만들고 기본 폴더 구조를 잡았다.",
    files: [
      {
        filename: "README.md",
        status: "modified",
        additions: 18,
        deletions: 1,
        patch: "@@ -1 +1,18 @@\n+# Commit to Blog\n+\n+초기 문서와 구조를 세팅했다.\n"
      }
    ]
  },
  "b77fd20": {
    sha: "b77fd20",
    message: "feat: build editorial metrics cards",
    authorName: "Donghyun",
    committedAt: "2026-05-12T14:05:00.000Z",
    url: "https://github.com/donghyun/ui-lab/commit/b77fd20",
    body: "카드형 메트릭 UI 실험.",
    files: [
      {
        filename: "src/components/MetricsCard.tsx",
        status: "added",
        additions: 33,
        deletions: 0,
        patch: "@@ -0,0 +1,33 @@\n+export function MetricsCard() {\n+  return <div className=\"metrics-card\" />;\n+}\n"
      }
    ]
  },
  "8f10ee1": {
    sha: "8f10ee1",
    message: "chore: seed ui experiments",
    authorName: "Donghyun",
    committedAt: "2026-05-10T06:00:00.000Z",
    url: "https://github.com/donghyun/ui-lab/commit/8f10ee1",
    body: "실험용 UI 저장소 초기화.",
    files: [
      {
        filename: "README.md",
        status: "modified",
        additions: 10,
        deletions: 0,
        patch: "@@ -0,0 +1,10 @@\n+# UI Lab\n+\n+실험용 저장소 시작.\n"
      }
    ]
  }
};

function key(owner: string, repo: string) {
  return `${owner}/${repo}`;
}

function branchKey(owner: string, repo: string, branch: string) {
  return `${owner}/${repo}::${branch}`;
}

export function listDemoRepositories() {
  return demoRepositories;
}

export function listDemoBranches(owner: string, repo: string) {
  return branchesByRepository[key(owner, repo)] ?? [];
}

export function listDemoCommits(owner: string, repo: string, branch: string) {
  return commitsByBranch[branchKey(owner, repo, branch)] ?? [];
}

export function getDemoCommitDetail(sha: string) {
  return commitDetailsBySha[sha] ?? null;
}

