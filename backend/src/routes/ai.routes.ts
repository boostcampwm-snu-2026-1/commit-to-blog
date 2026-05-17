import { Router } from 'express'
import { aiController } from '../controllers/ai.controller.js'
import { validate } from '../middleware/validate.js'
import { generatePostSchema } from '../schemas/ai.schema.js'
import { asyncHandler } from '../utils/asyncHandler.js'

export const aiRouter = Router()

aiRouter.post(
  '/generate-post',
  validate(generatePostSchema),
  asyncHandler(aiController.generatePost),
)
