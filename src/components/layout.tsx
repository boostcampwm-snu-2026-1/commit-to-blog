import { Outlet } from 'react-router';
import { Footer } from './footer';
import { Header } from './header';

export const Layout = () => {
  return (
    <div>
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
};
