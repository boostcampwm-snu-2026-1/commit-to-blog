import { Router } from 'express'
import {
  readAll,
  findById,
  create,
  update,
  remove,
} from '../store/posts.js'

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

const VALID_STATUS = ['draft', 'published']

router.get(
  '/posts',
  asyncHandler(async (req, res) => {
    res.json(await readAll())
  }),
)

router.get(
  '/posts/:id',
  asyncHandler(async (req, res) => {
    const post = await findById(req.params.id)
    if (!post) {
      return res.status(404).json({
        error: { code: 'NOT_FOUND', message: 'post not found' },
      })
    }
    res.json(post)
  }),
)

router.post(
  '/posts',
  asyncHandler(async (req, res) => {
    const { title, content, summary, status, source } = req.body ?? {}
    if (typeof title !== 'string' || typeof content !== 'string') {
      return res.status(400).json({
        error: {
          code: 'INVALID_INPUT',
          message: 'title and content are required strings',
        },
      })
    }
    if (status !== undefined && !VALID_STATUS.includes(status)) {
      return res.status(400).json({
        error: {
          code: 'INVALID_STATUS',
          message: `status must be one of ${VALID_STATUS.join(', ')}`,
        },
      })
    }
    const post = await create({ title, content, summary, status, source })
    res.status(201).json(post)
  }),
)

router.put(
  '/posts/:id',
  asyncHandler(async (req, res) => {
    const body = req.body ?? {}
    const patch = {}
    for (const key of ['title', 'content', 'summary', 'source']) {
      if (body[key] !== undefined) patch[key] = body[key]
    }
    if (body.status !== undefined) {
      if (!VALID_STATUS.includes(body.status)) {
        return res.status(400).json({
          error: {
            code: 'INVALID_STATUS',
            message: `status must be one of ${VALID_STATUS.join(', ')}`,
          },
        })
      }
      patch.status = body.status
    }
    const updated = await update(req.params.id, patch)
    if (!updated) {
      return res.status(404).json({
        error: { code: 'NOT_FOUND', message: 'post not found' },
      })
    }
    res.json(updated)
  }),
)

router.delete(
  '/posts/:id',
  asyncHandler(async (req, res) => {
    const ok = await remove(req.params.id)
    if (!ok) {
      return res.status(404).json({
        error: { code: 'NOT_FOUND', message: 'post not found' },
      })
    }
    res.json({ ok: true })
  }),
)

export default router
