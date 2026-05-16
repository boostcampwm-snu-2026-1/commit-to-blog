import { useEffect, useState } from 'react'
import { PostEditor } from '@/features/posts/components/PostEditor'
import { postsQueries } from '@/features/posts/queries'
import type { SavedPost } from '@/features/posts/types'

export function EditPostPage() {
  const [post, setPost] = useState<SavedPost | null>(null)

  useEffect(() => {
    async function loadPost() {
      setPost(await postsQueries.byId('post-1'))
    }

    void loadPost()
  }, [])

  if (!post) {
    return <section className="feature-panel">No draft found.</section>
  }

  return (
    <section className="feature-layout">
      <div className="feature-panel">
        <h2>Edit post</h2>
        <p>
          This page is the route-level wrapper. Editing UI and future mutations
          live in <code>features/posts</code>.
        </p>
      </div>
      <PostEditor post={post} />
    </section>
  )
}

export default EditPostPage
