import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import CreateBlogPage from './pages/CreateBlogPage';
import PostsPage from './pages/PostsPage';
import EditorPage from './pages/EditorPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/posts" replace />} />
          <Route path="/posts" element={<PostsPage />} />
          <Route path="/create" element={<CreateBlogPage />} />
          <Route path="/editor/:id?" element={<EditorPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
