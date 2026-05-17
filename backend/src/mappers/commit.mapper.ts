import type { Commit } from '@prisma/client'
import type { CommitDetailDTO, CommitListItemDTO } from '../types/dto.js'

export function mapCommitToListItemDTO(
  commit: Pick<Commit, 'sha' | 'message' | 'authorName' | 'authoredAt'>,
): CommitListItemDTO {
  return {
    sha: commit.sha,
    shortSha: commit.sha.slice(0, 7),
    message: commit.message,
    authorName: commit.authorName,
    authoredAt: commit.authoredAt.toISOString(),
  }
}

export function mapCommitDetailToDTO(commit: {
  sha: string
  message: string
  authorName: string
  authoredAt: Date
  changedFiles: string[]
  diff: string
}): CommitDetailDTO {
  return {
    sha: commit.sha,
    shortSha: commit.sha.slice(0, 7),
    message: commit.message,
    authorName: commit.authorName,
    authoredAt: commit.authoredAt.toISOString(),
    changedFiles: commit.changedFiles,
    diff: commit.diff,
  }
}
