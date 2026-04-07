import { Outlet } from 'react-router';

export const AdminLayout = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1" id="main-content">
        <Outlet />
      </main>
    </div>
  );
};
