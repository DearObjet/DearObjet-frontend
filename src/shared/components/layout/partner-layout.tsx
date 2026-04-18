import { Outlet } from 'react-router';

export const PartnerLayout = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};
