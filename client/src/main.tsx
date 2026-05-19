import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Navigate, RouterProvider, createBrowserRouter } from "react-router";

import "./styles/primitive.css";
import "./styles/semantic.css";
import "./styles/global.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/saved" replace />,
  },
  {
    path: "/saved",
    element: <main>Saved posts</main>,
  },
  {
    path: "/my-blog",
    element: <main>My blog</main>,
  },
  {
    path: "/post/:id/edit",
    element: <main>Edit post</main>,
  },
  {
    path: "/settings",
    element: <main>Settings</main>,
  },
]);

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
