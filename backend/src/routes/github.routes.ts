import { Router } from 'express'
import { githubController } from '../controllers/github.controller.js'
import { validate } from '../middleware/validate.js'
import {
  branchQuerySchema,
  commitParamsSchema,
  repositoryParamsSchema,
} from '../schemas/github.schema.js'
import { asyncHandler } from '../utils/asyncHandler.js'

export const githubRouter = Router()

githubRouter.get('/repositories', asyncHandler(githubController.listRepositories))
githubRouter.get(
  '/repositories/:repositoryId/branches',
  validate(repositoryParamsSchema, 'params'),
  asyncHandler(githubController.listBranches),
)
githubRouter.get(
  '/repositories/:repositoryId/commits',
  validate(repositoryParamsSchema, 'params'),
  validate(branchQuerySchema, 'query'),
  asyncHandler(githubController.listCommits),
)
githubRouter.get(
  '/repositories/:repositoryId/commits/:sha',
  validate(commitParamsSchema, 'params'),
  asyncHandler(githubController.getCommitDetail),
)
