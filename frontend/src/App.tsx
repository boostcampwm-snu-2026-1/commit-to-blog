import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import PostsListPage from './pages/PostsListPage';
import CreatePostPage from './pages/CreatePostPage';
import EditPostPage from './pages/EditPostPage';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-5xl mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<PostsListPage />} />
            <Route path="/create" element={<CreatePostPage />} />
            <Route path="/edit/:id" element={<EditPostPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
