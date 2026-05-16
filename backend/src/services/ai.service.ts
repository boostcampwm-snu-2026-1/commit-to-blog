import { commitRepository } from '../repositories/commit.repository.js'
import { repositoryRepository } from '../repositories/repository.repository.js'
import { userRepository } from '../repositories/user.repository.js'
import type { AuthenticatedUser, GeneratedPostPreviewDTO } from '../types/dto.js'
import { truncateDiff } from '../utils/truncateDiff.js'
import { githubService } from './github.service.js'

type GeneratePostInput = {
  currentUser: AuthenticatedUser
  repositoryId: string
  branchName: string
  commitSha: string
}

class AIService {
  buildPrompt(input: {
    repositoryName: string
    branchName: string
    commitMessage: string
    changedFiles: string[]
    diff: string
  }) {
    return [
      'Write an internal engineering blog draft from this commit.',
      'Do not invent any detail not supported by the commit data or diff.',
      `Repository: ${input.repositoryName}`,
      `Branch: ${input.branchName}`,
      `Commit message: ${input.commitMessage}`,
      `Changed files: ${input.changedFiles.join(', ') || 'None'}`,
      'Diff:',
      truncateDiff(input.diff),
    ].join('\n')
  }

  private buildPreviewFallback(input: {
    repositoryName: string
    branchName: string
    commitMessage: string
    changedFiles: string[]
  }): GeneratedPostPreviewDTO {
    return {
      title: `${input.repositoryName}: ${input.commitMessage}`,
      summary: `A draft preview generated from the ${input.branchName} branch commit touching ${input.changedFiles.length} file(s).`,
      body: [
        `This draft is based on the commit "${input.commitMessage}" in ${input.repositoryName}.`,
        '',
        'Files changed:',
        ...input.changedFiles.map((file) => `- ${file}`),
        '',
        'This content should be refined before publishing, but it stays grounded in the selected commit.',
      ].join('\n'),
      tags: ['engineering', 'github', 'draft'],
    }
  }

  async generatePostPreview(input: GeneratePostInput): Promise<GeneratedPostPreviewDTO> {
    const user = await userRepository.ensureUser(input.currentUser)
    const repository = await githubService.getRepositoryOrThrow(input.repositoryId)
    const commitDetail = await githubService.getCommitDetail(
      input.repositoryId,
      input.commitSha,
    )

    const persistedRepository = await repositoryRepository.upsertRepository({
      userId: user.id,
      githubRepoId: repository.id,
      owner: repository.owner,
      name: repository.name,
      defaultBranch: repository.defaultBranch,
    })

    await commitRepository.upsertCommit({
      repositoryId: persistedRepository.id,
      sha: commitDetail.sha,
      message: commitDetail.message,
      authorName: commitDetail.authorName,
      authorEmail: commitDetail.authorEmail,
      authoredAt: new Date(commitDetail.authoredAt),
    })

    this.buildPrompt({
      repositoryName: repository.fullName,
      branchName: input.branchName,
      commitMessage: commitDetail.message,
      changedFiles: commitDetail.changedFiles,
      diff: commitDetail.diff,
    })

    return this.buildPreviewFallback({
      repositoryName: repository.fullName,
      branchName: input.branchName,
      commitMessage: commitDetail.message,
      changedFiles: commitDetail.changedFiles,
    })
  }
}

export const aiService = new AIService()
