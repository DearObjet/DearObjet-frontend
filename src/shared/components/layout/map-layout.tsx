import { Outlet } from 'react-router';

export const MapLayout = () => {
  return (
    <div className="h-screen w-full">
      <main className="h-full w-full" id="main-content">
        <Outlet />
      </main>
    </div>
  );
};
