import type { SavedPost } from '../types'

type PostEditorProps = {
  post: SavedPost
}

export function PostEditor({ post }: PostEditorProps) {
  return (
    <section className="feature-panel">
      <div className="editor-grid">
        <label className="feature-field">
          <span>Title</span>
          <input value={post.title} readOnly />
        </label>
        <label className="feature-field">
          <span>Summary</span>
          <textarea value={post.summary} readOnly rows={3} />
        </label>
        <label className="feature-field">
          <span>Body</span>
          <textarea value={post.body} readOnly rows={7} />
        </label>
      </div>
      <p className="feature-note">
        Minimum feature scaffold: editor UI is present and ready to be wired to
        mutations.
      </p>
    </section>
  )
}
