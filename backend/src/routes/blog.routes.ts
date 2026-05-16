import { Router } from 'express'
import { blogController } from '../controllers/blog.controller.js'
import { validate } from '../middleware/validate.js'
import { blogParamsSchema, blogPostParamsSchema } from '../schemas/post.schema.js'
import { asyncHandler } from '../utils/asyncHandler.js'

export const blogRouter = Router()

blogRouter.get(
  '/:username',
  validate(blogParamsSchema, 'params'),
  asyncHandler(blogController.listPosts),
)
blogRouter.get(
  '/:username/:postId',
  validate(blogPostParamsSchema, 'params'),
  asyncHandler(blogController.getPost),
)
