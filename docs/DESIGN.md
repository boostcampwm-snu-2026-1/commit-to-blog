# Smart Blog Service - Design Document

## Data Structures

### TypeScript Interfaces
```typescript
interface CommitRef {
  sha: string;
  message: string;
  author: string;
  date: string;
}

interface Repository {
  id: number;
  name: string;
  fullName: string;
  description: string;
  defaultBranch: string;
  private: boolean;
}

interface Branch {
  name: string;
  sha: string;
}

interface Post {
  id: number;
  title: string;
  body: string;
  summary: string;
  repo_name: string;
  branch: string;
  commits: CommitRef[];
  tags: string[];
  created_at: string;
  updated_at: string;
  published: boolean;
}

interface BlogDraft {
  title: string;
  body: string;
  summary: string;
}

interface BlogGenerationRequest {
  repoFullName: string;
  branch: string;
  commitShas: string[];
  additionalContext?: string;
}
```

## SQLite Schema

```sql
CREATE TABLE IF NOT EXISTS posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  body TEXT NOT NULL DEFAULT '',
  summary TEXT NOT NULL DEFAULT '',
  repo_name TEXT NOT NULL,
  branch TEXT NOT NULL,
  commits_json TEXT NOT NULL DEFAULT '[]',
  tags_json TEXT NOT NULL DEFAULT '[]',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  published INTEGER NOT NULL DEFAULT 0
);
```

## API Endpoints (Express REST)

### GitHub Proxy Routes (`/api/github`)
| Method | Path | Description | Response |
|--------|------|-------------|----------|
| GET | `/api/github/repos` | List user repos | Repository[] |
| GET | `/api/github/repos/:owner/:repo/branches` | List branches | Branch[] |
| GET | `/api/github/repos/:owner/:repo/commits?branch=X&per_page=30` | List commits | CommitRef[] |
| GET | `/api/github/repos/:owner/:repo/commits/:sha` | Get commit + diff | CommitDetail |

### Blog Generation (`/api/blog`)
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/blog/generate` | Generate blog draft from commits via LLM |

Request body:
```json
{
  "repoFullName": "owner/repo",
  "branch": "main",
  "commitShas": ["abc123", "def456"],
  "additionalContext": "optional"
}
```

Response: `{ "title": "...", "body": "...", "summary": "..." }`

### Posts CRUD (`/api/posts`)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/posts` | List all posts |
| GET | `/api/posts/:id` | Get post by ID |
| POST | `/api/posts` | Create new post |
| PUT | `/api/posts/:id` | Update post |
| DELETE | `/api/posts/:id` | Delete post |
| POST | `/api/posts/:id/publish` | Set published=true |

## React Component Tree

```
App.tsx (BrowserRouter)
├── Header.tsx (nav: home + "새 글 작성" button)
└── Routes:
    ├── "/" → PostsListPage.tsx
    │   └── PostCard.tsx × N (title, summary, branch tag, date, edit link)
    ├── "/create" → CreatePostPage.tsx
    │   ├── Step 1: RepoSelector.tsx (search + list)
    │   ├── Step 2: BranchSelector.tsx (list)
    │   ├── Step 3: CommitList.tsx (checkbox multi-select)
    │   └── Step 4: BlogEditor.tsx (title input + textarea + save button)
    └── "/edit/:id" → EditPostPage.tsx
        └── BlogEditor.tsx + publish button
```

## State Flow

### CreatePostPage Wizard State
```typescript
{
  step: 1 | 2 | 3 | 4;
  selectedRepo: Repository | null;
  selectedBranch: string;
  selectedCommits: CommitRef[];
  title: string;
  body: string;
  summary: string;
  isGenerating: boolean;
  isSaving: boolean;
}
```

### Data Flow
```
User selects repo
  → RepoSelector calls GET /api/github/repos
  → User clicks repo → step 2

User selects branch
  → BranchSelector calls GET /api/github/repos/:owner/:repo/branches
  → User clicks branch → step 3

User selects commits
  → CommitList calls GET /api/github/repos/:owner/:repo/commits?branch=X
  → User checks commits → step 4 (after generate)

Generate
  → POST /api/blog/generate with {repoFullName, branch, commitShas}
  → Backend fetches diffs → calls LLM → returns {title, body, summary}
  → BlogEditor shows draft

Save
  → POST /api/posts with full post data
  → Redirect to /
```

## Storage Strategy

- SQLite file: `backend/data/posts.db` (not committed to git)
- JSON fields: `commits_json`, `tags_json` stored as serialized JSON strings
- Lazy init: DB created on first server start

## Key User Interactions

1. **홈 화면 진입** → GET /api/posts → render card grid
2. **새 글 작성** → /create → Step 1-4 wizard
3. **AI 생성** → POST /api/blog/generate → loading → draft in editor
4. **저장** → POST /api/posts → redirect home
5. **편집** → /edit/:id → GET /api/posts/:id → edit → PUT /api/posts/:id
6. **발행** → POST /api/posts/:id/publish → published badge

## Testing Criteria

### Week 1 Done When:
- [ ] CLAUDE.md exists and is complete
- [ ] docs/DESIGN.md exists
- [ ] week1-plan.md, week2-plan.md exist
- [ ] frontend/ and backend/ directories scaffolded
- [ ] GET /api/github/repos works with real token

### Week 2 Done When:
- [ ] Full create flow works end-to-end
- [ ] AI generates meaningful Korean blog post
- [ ] Posts save/load from SQLite
- [ ] Edit and publish flow works
- [ ] No API keys in frontend bundle
