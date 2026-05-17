import type { Repository } from '@prisma/client'
import type { RepositoryDTO } from '../types/dto.js'

export function mapRepositoryToDTO(
  repository: Pick<Repository, 'githubRepoId' | 'owner' | 'name' | 'defaultBranch'>,
): RepositoryDTO {
  return {
    id: repository.githubRepoId,
    owner: repository.owner,
    name: repository.name,
    fullName: `${repository.owner}/${repository.name}`,
    defaultBranch: repository.defaultBranch,
  }
}

export function mapGithubRepositoryToDTO(repository: {
  id: string
  owner: string
  name: string
  defaultBranch: string
}): RepositoryDTO {
  return {
    id: repository.id,
    owner: repository.owner,
    name: repository.name,
    fullName: `${repository.owner}/${repository.name}`,
    defaultBranch: repository.defaultBranch,
  }
}
