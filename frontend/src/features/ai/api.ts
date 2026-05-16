import type { GenerateDraftInput, GenerateDraftResult } from './types'

export async function generateDraftFromCommits(
  input: GenerateDraftInput,
): Promise<GenerateDraftResult> {
  const commitSummary = input.commits.map((commit) => commit.message).join(', ')

  return {
    id: 'ai-draft-1',
    title: `Draft from ${input.repositoryName}`,
    summary: `AI draft based on ${input.branchName} with ${input.commits.length} selected commit(s).`,
    body: `This generated draft summarizes the selected commits: ${commitSummary}. It is ready for further editing before publishing.`,
    status: 'draft',
    username: 'jane',
    postId: 'hello-commit-blog',
    sourceCommits: input.commits,
  }
}
