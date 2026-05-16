import { prisma } from '../db/prisma.js'

export const commitRepository = {
  async upsertCommit(input: {
    repositoryId: string
    sha: string
    message: string
    authorName: string
    authorEmail?: string | null
    authoredAt: Date
  }) {
    const existing = await prisma.commit.findFirst({
      where: {
        repositoryId: input.repositoryId,
        sha: input.sha,
      },
    })

    if (existing) {
      return prisma.commit.update({
        where: { id: existing.id },
        data: {
          message: input.message,
          authorName: input.authorName,
          authorEmail: input.authorEmail ?? null,
          authoredAt: input.authoredAt,
        },
      })
    }

    return prisma.commit.create({
      data: {
        repositoryId: input.repositoryId,
        sha: input.sha,
        message: input.message,
        authorName: input.authorName,
        authorEmail: input.authorEmail ?? null,
        authoredAt: input.authoredAt,
      },
    })
  },

  async findByRepositoryAndSha(repositoryId: string, sha: string) {
    return prisma.commit.findFirst({
      where: {
        repositoryId,
        sha,
      },
    })
  },
}
