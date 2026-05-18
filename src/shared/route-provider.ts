import { createBrowserRouter, RouterProvider } from 'react-router';
import { Layout } from '../components/layout';
import { PATH } from '../entity/path';
import { AboutPage } from '../pages/about-page';
import { PostPage } from '../pages/post-page';
import { ProjectPage } from '../pages/project-page';

const BROWSER_ROUTER = createBrowserRouter([
  {
    Component: Layout,
    children: [
      { path: PATH.HOME, Component: ProjectPage },
      { path: PATH.BLOG, Component: PostPage },
      { path: PATH.ABOUT, Component: AboutPage },
    ],
  },
]);

export const RouteProvider = () => {
  return RouterProvider({ router: BROWSER_ROUTER });
};
