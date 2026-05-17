import type { GithubCommit } from '../types'

type CommitListProps = {
  commits: GithubCommit[]
}

export function CommitList({ commits }: CommitListProps) {
  return (
    <ul className="stack-list">
      {commits.map((commit) => (
        <li key={commit.sha} className="stack-card">
          <div className="stack-card__row">
            <strong>{commit.message}</strong>
            <code>{commit.sha}</code>
          </div>
          <p>
            {commit.author} · {commit.committedAt}
          </p>
        </li>
      ))}
    </ul>
  )
}
