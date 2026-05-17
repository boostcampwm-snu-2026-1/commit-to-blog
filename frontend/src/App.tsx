import './App.css'
import { BlogPostPage } from '@/app/blog/[username]/[postId]/page'
import { MyBlogPage } from '@/app/my-blog/page'
import { EditPostPage } from '@/app/posts/[postId]/edit/page'
import { SavedPostsPage } from '@/app/saved-posts/page'

const routes = [
  { label: '/my-blog', element: <MyBlogPage /> },
  { label: '/saved-posts', element: <SavedPostsPage /> },
  { label: '/posts/42/edit', element: <EditPostPage /> },
  { label: '/blog/jane/hello-commit-blog', element: <BlogPostPage /> },
] as const

function App() {
  return (
    <main className="shell">
      <header className="hero-panel">
        <div>
          <p className="eyebrow">Commit to Blog</p>
          <h1>Feature-oriented scaffold with minimum working flows</h1>
          <p className="hero-copy">
            The app is split into route-level pages under <code>app/</code> and
            business modules under <code>features/</code>. The screens below use
            mocked data so the architecture is visible before real backend
            integration.
          </p>
        </div>
        <div className="hero-card">
          <p>Included feature slices</p>
          <ul>
            <li>GitHub repository, branch, and commit browsing</li>
            <li>AI draft generation preview and saved posts flow</li>
            <li>Editable post draft and published blog detail view</li>
          </ul>
        </div>
      </header>

      <section className="route-grid" aria-label="Architecture preview routes">
        {routes.map((route) => (
          <article key={route.label} className="route-card">
            <div className="route-header">
              <span className="route-path">{route.label}</span>
            </div>
            <div className="route-body">{route.element}</div>
          </article>
        ))}
      </section>
    </main>
  )
}

export default App
