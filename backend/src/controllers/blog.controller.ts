import type { Request, Response } from 'express'
import { blogService } from '../services/blog.service.js'

export const blogController = {
  async listPosts(request: Request, response: Response) {
    const posts = await blogService.listPublishedPosts(String(request.params.username))
    response.json(posts)
  },

  async getPost(request: Request, response: Response) {
    const post = await blogService.getPublishedPost(
      String(request.params.username),
      String(request.params.postId),
    )
    response.json(post)
  },
}
