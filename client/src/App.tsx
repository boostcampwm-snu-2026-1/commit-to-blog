import { Routes, Route, Navigate } from 'react-router-dom';
import Nav from './components/Nav';
import SavedPosts from './pages/SavedPosts';
import CreateBlog from './pages/CreateBlog';
import EditPost from './pages/EditPost';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Nav />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <Routes>
          <Route path="/" element={<Navigate to="/posts" replace />} />
          <Route path="/posts" element={<SavedPosts />} />
          <Route path="/create" element={<CreateBlog />} />
          <Route path="/posts/:id/edit" element={<EditPost />} />
        </Routes>
      </main>
    </div>
  );
}
