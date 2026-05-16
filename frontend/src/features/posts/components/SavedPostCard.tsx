import type { SavedPost } from '../types'

type SavedPostCardProps = {
  post: SavedPost
}

export function SavedPostCard({ post }: SavedPostCardProps) {
  return (
    <article className="stack-card">
      <div className="stack-card__row">
        <strong>{post.title}</strong>
        <span className="status-pill">{post.status}</span>
      </div>
      <p>{post.summary}</p>
      <small>
        /blog/{post.username}/{post.postId}
      </small>
    </article>
  )
}
