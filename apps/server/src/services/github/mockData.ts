import type { Branch, Commit, Repo } from "@commit-to-blog/shared";

/**
 * GITHUB_TOKEN이 없을 때 프로토타입을 살아있게 하는 더미 데이터.
 * week11 검증용. week12에서는 실제 토큰 사용을 권장.
 */
export const MOCK_REPOS: Repo[] = [
  {
    id: "mock-1",
    fullName: "jj1kim/commit-to-blog",
    name: "commit-to-blog",
    owner: {
      login: "jj1kim",
      avatarUrl: "https://avatars.githubusercontent.com/u/0?v=4",
    },
    defaultBranch: "main",
    description: "스마트블로그 — week11/12 과제 저장소",
    updatedAt: "2026-05-13T11:42:09Z",
  },
  {
    id: "mock-2",
    fullName: "jj1kim/vlsi-toolkit",
    name: "vlsi-toolkit",
    owner: {
      login: "jj1kim",
      avatarUrl: "https://avatars.githubusercontent.com/u/0?v=4",
    },
    defaultBranch: "main",
    description: "VLSI 수업 과제 모음",
    updatedAt: "2026-05-01T03:12:00Z",
  },
  {
    id: "mock-3",
    fullName: "jj1kim/note-taking-app",
    name: "note-taking-app",
    owner: {
      login: "jj1kim",
      avatarUrl: "https://avatars.githubusercontent.com/u/0?v=4",
    },
    defaultBranch: "main",
    description: null,
    updatedAt: "2026-04-12T18:00:00Z",
  },
];

const MOCK_BRANCHES_BY_REPO: Record<string, Branch[]> = {
  "jj1kim/commit-to-blog": [
    { name: "main", isDefault: true, headSha: "a1b2c3d4e5f6789012345678901234567890abcd" },
    { name: "feature/week11", isDefault: false, headSha: "d6bb8ecaaa1234567890abcdefabcdefabcdef12" },
    { name: "feature/week12", isDefault: false, headSha: "fedcba9876543210fedcba9876543210fedcba98" },
  ],
  "jj1kim/vlsi-toolkit": [
    { name: "main", isDefault: true, headSha: "1234567890abcdef1234567890abcdef12345678" },
    { name: "develop", isDefault: false, headSha: "abcdef1234567890abcdef1234567890abcdef12" },
  ],
  "jj1kim/note-taking-app": [
    { name: "main", isDefault: true, headSha: "fedcba9876543210fedcba9876543210fedcba98" },
  ],
};

export function mockBranchesFor(fullName: string): Branch[] {
  return MOCK_BRANCHES_BY_REPO[fullName] ?? [
    { name: "main", isDefault: true, headSha: "0000000000000000000000000000000000000000" },
  ];
}

const MOCK_COMMITS_BY_BRANCH: Record<string, Commit[]> = {
  "jj1kim/commit-to-blog#main": [
    {
      sha: "a1b2c3d4e5f6789012345678901234567890abcd",
      shortSha: "a1b2c3d",
      message: "Refactor auto-merge workflow into rule-based pipeline",
      author: {
        name: "jj1kim",
        login: "jj1kim",
        avatarUrl: "https://avatars.githubusercontent.com/u/0?v=4",
      },
      committedAt: "2026-05-13T02:42:09Z",
    },
    {
      sha: "3e7504c89abcdef0123456789abcdef012345678",
      shortSha: "3e7504c",
      message: "Update auto-merge.yml",
      author: {
        name: "jj1kim",
        login: "jj1kim",
        avatarUrl: "https://avatars.githubusercontent.com/u/0?v=4",
      },
      committedAt: "2026-05-13T01:30:00Z",
    },
  ],
  "jj1kim/commit-to-blog#feature/week11": [
    {
      sha: "d6bb8ecaaa1234567890abcdefabcdefabcdef12",
      shortSha: "d6bb8ec",
      message: "Add CLAUDE.md project guide, checklist, and full README",
      author: {
        name: "jj1kim",
        login: "jj1kim",
        avatarUrl: "https://avatars.githubusercontent.com/u/0?v=4",
      },
      committedAt: "2026-05-13T22:30:00Z",
    },
    {
      sha: "853793a0000000000000000000000000abcdef00",
      shortSha: "853793a",
      message: "Add feature-scaffold Claude Skill, AI workflow, and test plan",
      author: {
        name: "jj1kim",
        login: "jj1kim",
        avatarUrl: "https://avatars.githubusercontent.com/u/0?v=4",
      },
      committedAt: "2026-05-13T22:00:00Z",
    },
    {
      sha: "d9d99860000000000000000000000000abcdef00",
      shortSha: "d9d9986",
      message: "Scaffold monorepo prototype: shared types, Express+Octokit server, Vite+React+Tailwind client",
      author: {
        name: "jj1kim",
        login: "jj1kim",
        avatarUrl: "https://avatars.githubusercontent.com/u/0?v=4",
      },
      committedAt: "2026-05-13T20:00:00Z",
    },
  ],
  "jj1kim/vlsi-toolkit#main": [
    {
      sha: "1234567890abcdef1234567890abcdef12345678",
      shortSha: "1234567",
      message: "Fix simulation timing for setup/hold checks",
      author: {
        name: "jj1kim",
        login: "jj1kim",
        avatarUrl: "https://avatars.githubusercontent.com/u/0?v=4",
      },
      committedAt: "2026-05-01T02:12:00Z",
    },
  ],
};

export function mockCommitsFor(fullName: string, branch: string): Commit[] {
  const key = `${fullName}#${branch}`;
  const found = MOCK_COMMITS_BY_BRANCH[key];
  if (found) return found;
  return [
    {
      sha: "0000000000000000000000000000000000000000",
      shortSha: "0000000",
      message: "(mock) Initial commit",
      author: {
        name: "mock-user",
        login: null,
        avatarUrl: null,
      },
      committedAt: "2026-05-01T00:00:00Z",
    },
  ];
}
