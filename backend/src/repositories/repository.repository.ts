import { prisma } from '../db/prisma.js'

export const repositoryRepository = {
  async upsertRepository(input: {
    userId: string
    githubRepoId: string
    owner: string
    name: string
    defaultBranch: string
  }) {
    const existing = await prisma.repository.findFirst({
      where: {
        userId: input.userId,
        githubRepoId: input.githubRepoId,
      },
    })

    if (existing) {
      return prisma.repository.update({
        where: { id: existing.id },
        data: {
          owner: input.owner,
          name: input.name,
          defaultBranch: input.defaultBranch,
        },
      })
    }

    return prisma.repository.create({
      data: input,
    })
  },

  async findByUserAndGithubRepoId(userId: string, githubRepoId: string) {
    return prisma.repository.findFirst({
      where: {
        userId,
        githubRepoId,
      },
    })
  },
}
