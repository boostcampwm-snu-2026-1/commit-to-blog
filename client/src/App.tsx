import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import CreateBlogPage from './pages/CreateBlogPage';
import SavedPostsPage from './pages/SavedPostsPage';
import SettingsPage from './pages/SettingsPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Navigate to="/saved" replace />} />
          <Route path="/create" element={<CreateBlogPage />} />
          <Route path="/saved" element={<SavedPostsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
