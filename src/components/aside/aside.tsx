import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';

import UserProfile from './user-profile';
import { Asidetab } from './aside-tab-icon';

import { MessageCircleMore } from 'lucide-react';

const Aside: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeMenu, setActiveMenu] = useState(location.pathname);

  const handleClick = (path: string) => {
    setActiveMenu(path);
    navigate(path);
  };

  return (
    <aside className="flex h-screen flex-col bg-black pb-[2.875rem] pl-[2.375rem] pr-[3.75rem] pt-[3.25rem] text-white">
      <section className="flex text-[1.1875rem]">
        <img src="" alt="dear objet 로고" />
        <h2>my pape</h2>
      </section>

      <nav className="mt-[3.375rem] flex flex-col gap-[1.9375rem]">
        <h2 className="text-sm">Manage</h2>
        <Asidetab
          icon={MessageCircleMore}
          label="관리 홈"
          className={
            activeMenu === '/dashboard' ? 'text-white' : 'text-[#C1C1C1]'
          }
          onClick={() => handleClick('/dashboard')}
        />
        <Asidetab
          icon={MessageCircleMore}
          label="입점관리"
          className={activeMenu === '/shop' ? 'text-white' : 'text-[#C1C1C1]'}
          onClick={() => handleClick('/shop')}
        />
        <Asidetab
          icon={MessageCircleMore}
          label="정산관리"
          className={
            activeMenu === '/settlement' ? 'text-white' : 'text-[#C1C1C1]'
          }
          onClick={() => handleClick('/settlement')}
        />
        <Asidetab
          icon={MessageCircleMore}
          label="메시지"
          className={
            activeMenu === '/message' ? 'text-white' : 'text-[#C1C1C1]'
          }
          onClick={() => handleClick('/message')}
        />
      </nav>

      <section className="mt-[3.375rem] flex flex-col gap-[1.9375rem]">
        <h2 className="text-sm">Preferences</h2>
        <Asidetab
          icon={MessageCircleMore}
          label="공지사항"
          className={activeMenu === '/notice' ? 'text-white' : 'text-[#C1C1C1]'}
          onClick={() => handleClick('/notice')}
        />
        <Asidetab
          icon={MessageCircleMore}
          label="환경설정"
          className={
            activeMenu === '/settings' ? 'text-white' : 'text-[#C1C1C1]'
          }
          onClick={() => handleClick('/settings')}
        />
      </section>

      <UserProfile className="mt-auto" />
    </aside>
  );
};

export default Aside;
