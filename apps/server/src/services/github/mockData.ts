import type { Repo } from "@commit-to-blog/shared";

/**
 * GITHUB_TOKEN이 없을 때 프로토타입을 살아있게 하는 더미 데이터.
 * week11 검증용. week12에서는 실제 토큰 사용을 강제할 예정.
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
