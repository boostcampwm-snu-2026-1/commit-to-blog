import express from 'express'
import { requireAuth } from './middleware/auth.js'
import { errorHandler } from './middleware/errorHandler.js'
import { aiRouter } from './routes/ai.routes.js'
import { authRouter } from './routes/auth.routes.js'
import { blogRouter } from './routes/blog.routes.js'
import { githubRouter } from './routes/github.routes.js'
import { postRouter } from './routes/post.routes.js'

export function createApp() {
  const app = express()

  app.use(express.json())

  app.get('/health', (_request, response) => {
    response.json({
      ok: true,
      service: 'smart-blog-backend',
    })
  })

  app.use('/api/auth', requireAuth, authRouter)
  app.use('/api/github', requireAuth, githubRouter)
  app.use('/api/ai', requireAuth, aiRouter)
  app.use('/api/posts', requireAuth, postRouter)
  app.use('/api/blog', blogRouter)

  app.use(errorHandler)

  return app
}
