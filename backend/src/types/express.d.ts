import type { AuthenticatedUser } from './dto.js'

declare global {
  namespace Express {
    interface Request {
      currentUser?: AuthenticatedUser
    }
  }
}

export {}
