import { Outlet } from 'react-router';

import { Aside } from './aside/aside';
import { PartnerHeader } from './partner-header';

export const PartnerLayout = () => {
  return (
    <div className="flex min-h-screen w-full">
      <Aside />

      <div className="flex flex-1 flex-col">
        <PartnerHeader />

        <main className="flex-1 bg-gray-100">
          <div className="mx-auto w-full max-w-[120rem] p-5 px-[3.625rem]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
