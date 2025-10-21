import React from 'react';

import UserProfile from './user-profile';

const Aside: React.FC = () => {
  return (
    <>
      <aside className="flex h-screen flex-col bg-black pb-[2.875rem] pl-[2.375rem] pr-[3.75rem] pt-[3.25rem] text-white">
        <section className="text-[1.1875rem]">
          <img src="" alt="dear objet 로고" />
          <h2 className="text-sm">my pape</h2>
        </section>

        <section>
          <h2 className="text-sm">Manage</h2>
        </section>

        <section>
          <h2 className="text-sm">Preferences</h2>
        </section>

        <UserProfile className="mt-auto" />
      </aside>
    </>
  );
};

export default Aside;
