import type { Request, Response } from 'express'
import { githubService } from '../services/github.service.js'

export const githubController = {
  async listRepositories(_request: Request, response: Response) {
    const repositories = await githubService.listRepositories()
    response.json(repositories)
  },

  async listBranches(request: Request, response: Response) {
    const branches = await githubService.listBranches(
      String(request.params.repositoryId),
    )
    response.json(branches)
  },

  async listCommits(request: Request, response: Response) {
    const commits = await githubService.listCommits(
      String(request.params.repositoryId),
      String(request.query.branch),
    )
    response.json(commits)
  },

  async getCommitDetail(request: Request, response: Response) {
    const commit = await githubService.getCommitDetail(
      String(request.params.repositoryId),
      String(request.params.sha),
    )
    response.json(commit)
  },
}
