import { Router } from 'express'
import { postController } from '../controllers/post.controller.js'
import { validate } from '../middleware/validate.js'
import {
  createPostSchema,
  postIdParamsSchema,
  postsQuerySchema,
  updatePostSchema,
} from '../schemas/post.schema.js'
import { asyncHandler } from '../utils/asyncHandler.js'

export const postRouter = Router()

postRouter.get('/', validate(postsQuerySchema, 'query'), asyncHandler(postController.listPosts))
postRouter.post('/', validate(createPostSchema), asyncHandler(postController.createPost))
postRouter.get('/:postId', validate(postIdParamsSchema, 'params'), asyncHandler(postController.getPost))
postRouter.patch(
  '/:postId',
  validate(postIdParamsSchema, 'params'),
  validate(updatePostSchema),
  asyncHandler(postController.updatePost),
)
postRouter.post(
  '/:postId/publish',
  validate(postIdParamsSchema, 'params'),
  asyncHandler(postController.publishPost),
)
postRouter.delete(
  '/:postId',
  validate(postIdParamsSchema, 'params'),
  asyncHandler(postController.deletePost),
)
