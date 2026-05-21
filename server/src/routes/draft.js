import { Router } from 'express'
import { getCommit } from '../services/github.js'
import { generateDraft } from '../services/llm.js'

const router = Router()

function asyncHandler(fn) {
  return async (req, res) => {
    try {
      await fn(req, res)
    } catch (err) {
      const status = err.status || 500
      res.status(status).json({
        error: {
          code: err.code || 'UNKNOWN',
          message: err.message,
        },
      })
    }
  }
}

router.post(
  '/draft',
  asyncHandler(async (req, res) => {
    const { owner, repo, commitShas } = req.body ?? {}

    if (typeof owner !== 'string' || typeof repo !== 'string') {
      return res.status(400).json({
        error: {
          code: 'INVALID_INPUT',
          message: 'owner and repo are required strings',
        },
      })
    }
    if (!Array.isArray(commitShas) || commitShas.length === 0) {
      return res.status(400).json({
        error: {
          code: 'INVALID_INPUT',
          message: 'commitShas must be a non-empty array',
        },
      })
    }
    if (!commitShas.every((s) => typeof s === 'string' && s.length > 0)) {
      return res.status(400).json({
        error: {
          code: 'INVALID_INPUT',
          message: 'commitShas must contain non-empty strings',
        },
      })
    }

    const commits = await Promise.all(
      commitShas.map((sha) => getCommit(owner, repo, sha)),
    )

    const draft = await generateDraft({ commits })
    res.json(draft)
  }),
)

export default router
