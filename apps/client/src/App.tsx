import { Link, NavLink, Route, Routes } from "react-router-dom";
import { SavedPostsPage } from "./pages/SavedPostsPage.js";
import { CreatePostPage } from "./pages/CreatePostPage.js";
import { EditPostPage } from "./pages/EditPostPage.js";

function NavTab({ to, label }: { to: string; label: string }) {
  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        `rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
          isActive
            ? "bg-slate-900 text-white"
            : "text-slate-600 hover:bg-slate-100"
        }`
      }
    >
      {label}
    </NavLink>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <Link to="/" className="text-lg font-bold text-slate-900">
            Smart Blog
          </Link>
          <nav className="flex items-center gap-1">
            <NavTab to="/" label="Saved Posts" />
            <NavTab to="/create" label="My Blog" />
          </nav>
        </div>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<SavedPostsPage />} />
          <Route path="/create" element={<CreatePostPage />} />
          <Route path="/posts/:id/edit" element={<EditPostPage />} />
          <Route
            path="*"
            element={
              <section className="mx-auto max-w-6xl px-6 py-12 text-center text-slate-500">
                404 — 경로를 찾을 수 없습니다.
              </section>
            }
          />
        </Routes>
      </main>

      <footer className="mt-12 border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-4 text-xs text-slate-400">
          SMART_BLOG_SYSTEM — week11/12 학습 과제
        </div>
      </footer>
    </div>
  );
}
