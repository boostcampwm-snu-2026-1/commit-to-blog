import { Route, Routes } from 'react-router-dom';
import Header from './components/layout/Header';
import MyBlogPage from './pages/MyBlogPage';
import SavedPostsPage from './pages/SavedPostsPage';
import SettingsPage from './pages/SettingsPage';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Routes>
        <Route path="/" element={<MyBlogPage />} />
        <Route path="/saved" element={<SavedPostsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </div>
  );
}

export default App;
