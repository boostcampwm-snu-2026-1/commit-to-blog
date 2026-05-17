import type { SavedPost } from './types'

const savedPosts: SavedPost[] = [
  {
    id: 'post-1',
    title: 'How I set up commit-driven blog drafting',
    summary: 'A walkthrough of the initial architecture and AI workflow.',
    body: `This draft starts from GitHub commits, groups meaningful changes, and turns them into a post structure that can be edited before publishing.`,
    status: 'draft',
    username: 'jane',
    postId: 'hello-commit-blog',
    sourceCommits: [
      {
        sha: '0eb85e8',
        message: 'feat: #2 install tailwindcss and shadcn',
        author: 'teseuteu',
        committedAt: '2026-05-17 11:20',
      },
    ],
  },
  {
    id: 'post-2',
    title: 'Publishing notes for the internal blog',
    summary: 'The published version users see on the internal blog route.',
    body: `This post shows the final route shape for the public blog detail page and keeps the connection to source commits visible.`,
    status: 'published',
    username: 'jane',
    postId: 'published-architecture-note',
    sourceCommits: [
      {
        sha: '7c07ccc',
        message: 'docs: #1 commit message rules',
        author: 'teseuteu',
        committedAt: '2026-05-17 10:12',
      },
    ],
  },
]

export async function fetchSavedPosts(): Promise<SavedPost[]> {
  return savedPosts
}

export async function fetchSavedPost(postId: string): Promise<SavedPost | null> {
  return savedPosts.find((post) => post.id === postId) ?? null
}
