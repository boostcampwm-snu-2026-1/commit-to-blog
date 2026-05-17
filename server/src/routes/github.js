import { Router } from 'express'
import {
  listRepos,
  listBranches,
  listCommits,
  getCommit,
} from '../services/github.js'

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

router.get(
  '/repos',
  asyncHandler(async (req, res) => {
    const repos = await listRepos()
    res.json(repos)
  }),
)

router.get(
  '/repos/:owner/:repo/branches',
  asyncHandler(async (req, res) => {
    const { owner, repo } = req.params
    const branches = await listBranches(owner, repo)
    res.json(branches)
  }),
)

router.get(
  '/repos/:owner/:repo/commits',
  asyncHandler(async (req, res) => {
    const { owner, repo } = req.params
    const { branch } = req.query
    if (!branch) {
      return res.status(400).json({
        error: {
          code: 'MISSING_BRANCH',
          message: 'query param "branch" is required',
        },
      })
    }
    const commits = await listCommits(owner, repo, branch)
    res.json(commits)
  }),
)

router.get(
  '/repos/:owner/:repo/commits/:sha',
  asyncHandler(async (req, res) => {
    const { owner, repo, sha } = req.params
    const commit = await getCommit(owner, repo, sha)
    res.json(commit)
  }),
)

export default router
