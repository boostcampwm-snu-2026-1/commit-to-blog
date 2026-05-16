import { useEffect, useState } from 'react'
import { GeneratedPostPreview } from '@/features/posts/components/GeneratedPostPreview'
import { postsQueries } from '@/features/posts/queries'
import type { SavedPost } from '@/features/posts/types'

export function BlogPostPage() {
  const [post, setPost] = useState<SavedPost | null>(null)

  useEffect(() => {
    async function loadPost() {
      const publishedPosts = await postsQueries.all()
      setPost(
        publishedPosts.find((item) => item.status === 'published') ?? null,
      )
    }

    void loadPost()
  }, [])

  if (!post) {
    return <section className="feature-panel">No published post found.</section>
  }

  return (
    <section className="feature-layout">
      <div className="feature-panel">
        <h2>
          {post.username}/{post.postId}
        </h2>
        <p>Public blog detail route using the same posts feature data model.</p>
      </div>
      <GeneratedPostPreview post={post} />
    </section>
  )
}

export default BlogPostPage
