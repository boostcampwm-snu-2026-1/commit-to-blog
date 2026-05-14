export const repositories = [
  {
    id: 1,
    name: "commit-to-blog",
    owner: "rlafurud",
    fullName: "rlafurud/commit-to-blog",
  },
  {
    id: 2,
    name: "newsstand",
    owner: "rlafurud",
    fullName: "rlafurud/newsstand",
  },
  {
    id: 3,
    name: "portfolio",
    owner: "rlafurud",
    fullName: "rlafurud/portfolio",
  },
];

export const branches = {
  "rlafurud/commit-to-blog": [
    { name: "main", commitSha: "f4f32a0" },
    { name: "feature/blog-editor", commitSha: "8d213ba" },
  ],
  "rlafurud/newsstand": [
    { name: "main", commitSha: "7e36a12" },
    { name: "feature/react-week2", commitSha: "91ac88d" },
  ],
  "rlafurud/portfolio": [
    { name: "main", commitSha: "12a9f0e" },
    { name: "feature/about-page", commitSha: "2b33f11" },
  ],
};

export const commits = [
  {
    sha: "f4f32a0d8",
    branch: "main",
    message: "Fix user login bug",
    author: "rlafurud",
    date: "2026-05-14",
  },
  {
    sha: "12a91cbe9",
    branch: "main",
    message: "Update README with setup instructions",
    author: "rlafurud",
    date: "2026-05-13",
  },
  {
    sha: "8d213bad7",
    branch: "feature/blog-editor",
    message: "Refactor authentication module",
    author: "rlafurud",
    date: "2026-05-12",
  },
  {
    sha: "ab9031ee2",
    branch: "feature/blog-editor",
    message: "Add commit based blog editor",
    author: "rlafurud",
    date: "2026-05-11",
  },
  {
    sha: "7e36a12cd",
    branch: "feature/react-week2",
    message: "Convert newsstand view to React",
    author: "rlafurud",
    date: "2026-05-10",
  },
];

export const savedPosts = [
  {
    id: "post-1",
    title: "Refactoring Auth Module",
    branch: "main",
    summary: "인증 모듈의 책임을 나누고 예외 처리를 정리한 과정을 기록했습니다.",
    content: "# Refactoring Auth Module\n\n인증 모듈의 책임을 나누고 예외 처리를 정리했습니다.",
    createdAt: "2026-05-21",
    status: "draft",
    commitSha: "8d213ba",
  },
  {
    id: "post-2",
    title: "Fix API Race Conditions",
    branch: "feature/api-sync",
    summary: "비동기 API 요청 순서 문제를 해결하며 배운 점을 정리했습니다.",
    content: "# Fix API Race Conditions\n\n비동기 API 요청 순서 문제를 해결했습니다.",
    createdAt: "2026-05-20",
    status: "draft",
    commitSha: "e4f32a0",
  },
  {
    id: "post-3",
    title: "Docs: Update Architecture",
    branch: "develop",
    summary: "서비스 구조를 문서로 정리하고 협업 기준을 맞춘 과정을 기록했습니다.",
    content: "# Docs: Update Architecture\n\n서비스 구조를 문서로 정리했습니다.",
    createdAt: "2026-05-18",
    status: "published",
    commitSha: "aa91c22",
  },
];
