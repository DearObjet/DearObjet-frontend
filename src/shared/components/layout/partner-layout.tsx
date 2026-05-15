import { Outlet } from 'react-router';

import { Aside } from './aside/aside';
import { PartnerHeader } from './partner-header';

export const PartnerLayout = () => {
  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Aside />

      <div className="flex min-h-0 flex-1 flex-col">
        <PartnerHeader />

        <main className="flex-1 overflow-y-auto bg-gray-100">
          <div className="mx-auto h-full w-full max-w-[120rem] px-[3.625rem] py-5">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
