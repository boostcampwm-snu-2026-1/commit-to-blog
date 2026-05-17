import { z } from 'zod'

export const generatePostSchema = z.object({
  repositoryId: z.string().min(1),
  branchName: z.string().min(1),
  commitSha: z.string().min(1),
})
