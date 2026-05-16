import { z } from 'zod'

export const repositoryParamsSchema = z.object({
  repositoryId: z.string().min(1),
})

export const commitParamsSchema = repositoryParamsSchema.extend({
  sha: z.string().min(1),
})

export const branchQuerySchema = z.object({
  branch: z.string().min(1).default('main'),
})
