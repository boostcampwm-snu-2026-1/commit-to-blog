import type { Request, Response } from 'express'
import { userRepository } from '../repositories/user.repository.js'

export const authController = {
  async me(request: Request, response: Response) {
    const user = await userRepository.ensureUser(request.currentUser!)

    response.json({
      id: user.id,
      githubId: user.githubId,
      username: user.username,
      avatarUrl: user.avatarUrl,
    })
  },

  async logout(_request: Request, response: Response) {
    response.status(204).send()
  },
}
