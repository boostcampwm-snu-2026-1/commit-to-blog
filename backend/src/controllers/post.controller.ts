import type { Request, Response } from 'express'
import { postService } from '../services/post.service.js'

export const postController = {
  async listPosts(request: Request, response: Response) {
    const posts = await postService.listPosts(
      request.currentUser!,
      request.query.status as 'all' | 'draft' | 'published',
    )
    response.json(posts)
  },

  async createPost(request: Request, response: Response) {
    const post = await postService.createPost(request.currentUser!, request.body)
    response.status(201).json(post)
  },

  async getPost(request: Request, response: Response) {
    const post = await postService.getPost(
      request.currentUser!,
      String(request.params.postId),
    )
    response.json(post)
  },

  async updatePost(request: Request, response: Response) {
    const post = await postService.updatePost(
      request.currentUser!,
      String(request.params.postId),
      request.body,
    )
    response.json(post)
  },

  async publishPost(request: Request, response: Response) {
    const post = await postService.publishPost(
      request.currentUser!,
      String(request.params.postId),
    )
    response.json(post)
  },

  async deletePost(request: Request, response: Response) {
    const result = await postService.deletePost(
      request.currentUser!,
      String(request.params.postId),
    )
    response.json(result)
  },
}
