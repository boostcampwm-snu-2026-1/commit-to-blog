import { useEffect, useState } from 'react'
import { BranchSelector } from '@/features/github/components/BranchSelector'
import { CommitList } from '@/features/github/components/CommitList'
import { RepositorySelector } from '@/features/github/components/RepositorySelector'
import { aiMutations } from '@/features/ai/mutations'
import { GeneratedPostPreview } from '@/features/posts/components/GeneratedPostPreview'
import { githubQueries } from '@/features/github/queries'
import type {
  GithubBranch,
  GithubCommit,
  GithubRepository,
} from '@/features/github/types'
import type { SavedPost } from '@/features/posts/types'

export function MyBlogPage() {
  const [repositories, setRepositories] = useState<GithubRepository[]>([])
  const [branches, setBranches] = useState<GithubBranch[]>([])
  const [commits, setCommits] = useState<GithubCommit[]>([])
  const [selectedRepositoryId, setSelectedRepositoryId] = useState('')
  const [selectedBranch, setSelectedBranch] = useState('')
  const [draft, setDraft] = useState<SavedPost | null>(null)

  useEffect(() => {
    async function loadRepositories() {
      const repositoryItems = await githubQueries.repositories()
      setRepositories(repositoryItems)
      const initialRepository = repositoryItems[0]

      if (!initialRepository) {
        return
      }

      setSelectedRepositoryId(initialRepository.id)
    }

    void loadRepositories()
  }, [])

  useEffect(() => {
    if (!selectedRepositoryId) {
      return
    }

    async function loadBranches() {
      const branchItems = await githubQueries.branches(selectedRepositoryId)
      setBranches(branchItems)
      setSelectedBranch(branchItems[0]?.name ?? '')
    }

    void loadBranches()
  }, [selectedRepositoryId])

  useEffect(() => {
    if (!selectedRepositoryId || !selectedBranch) {
      return
    }

    async function loadCommits() {
      const commitItems = await githubQueries.commits(
        selectedRepositoryId,
        selectedBranch,
      )
      setCommits(commitItems)
      const repository = repositories.find((item) => item.id === selectedRepositoryId)

      if (!repository || commitItems.length === 0) {
        setDraft(null)
        return
      }

      const generatedDraft = await aiMutations.generateDraft({
        repositoryName: repository.name,
        branchName: selectedBranch,
        commits: commitItems.slice(0, 2),
      })

      setDraft(generatedDraft)
    }

    void loadCommits()
  }, [repositories, selectedRepositoryId, selectedBranch])

  return (
    <section className="feature-layout">
      <div className="feature-panel">
        <div className="field-grid">
          <RepositorySelector
            repositories={repositories}
            value={selectedRepositoryId}
            onChange={setSelectedRepositoryId}
          />
          <BranchSelector
            branches={branches}
            value={selectedBranch}
            onChange={setSelectedBranch}
          />
        </div>
        <p className="feature-note">
          Minimum flow: select a repository and branch, then inspect recent
          commits and the generated AI draft preview.
        </p>
      </div>
      <CommitList commits={commits} />
      {draft ? <GeneratedPostPreview post={draft} /> : null}
    </section>
  )
}

export default MyBlogPage
