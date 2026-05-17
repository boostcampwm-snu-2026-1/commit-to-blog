import type { Request, Response } from 'express'
import { aiService } from '../services/ai.service.js'

export const aiController = {
  async generatePost(request: Request, response: Response) {
    const preview = await aiService.generatePostPreview({
      currentUser: request.currentUser!,
      repositoryId: request.body.repositoryId,
      branchName: request.body.branchName,
      commitSha: request.body.commitSha,
    })

    response.json(preview)
  },
}
