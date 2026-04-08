import { Outlet } from 'react-router';

import { Header } from './header';
import { Footer } from './footer';

export const MainLayout = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1" id="main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
