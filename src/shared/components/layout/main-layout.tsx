import { Outlet } from 'react-router';

import { Header } from './header';
import { Footer } from './footer';

export const MainLayout = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1" id="main-content">
        <div className="mx-auto w-full max-w-[120rem] px-6 py-6 md:px-10 xl:px-[19.469rem]">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
};
