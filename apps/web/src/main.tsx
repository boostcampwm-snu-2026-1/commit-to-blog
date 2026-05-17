import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";

import { AppShell } from "./layouts/AppShell";
import { CreateBlogPage } from "./pages/CreateBlogPage";
import { PostEditorPage } from "./pages/PostEditorPage";
import { SavedPostsPage } from "./pages/SavedPostsPage";
import "./styles.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppShell />,
    children: [
      {
        index: true,
        element: <Navigate to="/create" replace />
      },
      {
        path: "create",
        element: <CreateBlogPage />
      },
      {
        path: "posts",
        element: <SavedPostsPage />
      },
      {
        path: "posts/:postId",
        element: <PostEditorPage />
      }
    ]
  }
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);

