import { useEffect, useState } from 'react'
import { SavedPostCard } from '@/features/posts/components/SavedPostCard'
import { postsQueries } from '@/features/posts/queries'
import type { SavedPost } from '@/features/posts/types'

export function SavedPostsPage() {
  const [posts, setPosts] = useState<SavedPost[]>([])

  useEffect(() => {
    async function loadPosts() {
      setPosts(await postsQueries.all())
    }

    void loadPosts()
  }, [])

  return (
    <section className="feature-layout">
      <div className="feature-panel">
        <h2>Saved posts</h2>
        <p>Drafts and published posts are both visible from one feature slice.</p>
      </div>
      <div className="feature-stack">
        {posts.map((post) => (
          <SavedPostCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  )
}

export default SavedPostsPage
