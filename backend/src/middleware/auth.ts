import type { NextFunction, Request, Response } from 'express'
import { env } from '../config/env.js'

export function requireAuth(
  request: Request,
  _response: Response,
  next: NextFunction,
) {
  request.currentUser = {
    githubId: env.DEFAULT_GITHUB_USER_ID,
    username: env.DEFAULT_GITHUB_USERNAME,
    avatarUrl: env.DEFAULT_GITHUB_AVATAR_URL,
  }

  next()
}
