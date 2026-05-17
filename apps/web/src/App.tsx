import { Outlet, Route, Routes } from "react-router-dom";
import { Header } from "./components/layout/Header";
import { Footer } from "./components/layout/Footer";
import { MyBlogPage } from "./routes/MyBlogPage";
import { SavedPostsPage } from "./routes/SavedPostsPage";
import { SettingsPage } from "./routes/SettingsPage";

function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<MyBlogPage />} />
        <Route path="saved" element={<SavedPostsPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  );
}
