import type { SavedPost } from '../types'

type GeneratedPostPreviewProps = {
  post: SavedPost
}

export function GeneratedPostPreview({ post }: GeneratedPostPreviewProps) {
  return (
    <article className="feature-panel">
      <div className="feature-panel__meta">
        <span className="status-pill">{post.status}</span>
        <span>{post.sourceCommits.length} source commit(s)</span>
      </div>
      <h3>{post.title}</h3>
      <p>{post.summary}</p>
      <div className="preview-body">
        <p>{post.body}</p>
      </div>
    </article>
  )
}
