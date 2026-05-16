import { prisma } from '../db/prisma.js'
import type { AuthenticatedUser } from '../types/dto.js'

export const userRepository = {
  async ensureUser(user: AuthenticatedUser) {
    return prisma.user.upsert({
      where: { githubId: user.githubId },
      update: {
        username: user.username,
        avatarUrl: user.avatarUrl ?? null,
      },
      create: {
        githubId: user.githubId,
        username: user.username,
        avatarUrl: user.avatarUrl ?? null,
      },
    })
  },

  async findByUsername(username: string) {
    return prisma.user.findUnique({
      where: { username },
    })
  },
}
