import { Router } from 'express'
import { authController } from '../controllers/auth.controller.js'
import { asyncHandler } from '../utils/asyncHandler.js'

export const authRouter = Router()

authRouter.get('/me', asyncHandler(authController.me))
authRouter.post('/logout', asyncHandler(authController.logout))
