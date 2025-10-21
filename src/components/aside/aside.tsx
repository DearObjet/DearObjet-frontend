import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';

import UserProfile from './user-profile';
import { Asidetab } from './aside-tab-menu';

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
        <div className="flex flex-col gap-5">
          <Asidetab
            icon={MessageCircleMore}
            label="관리 홈"
            className={
              activeMenu.startsWith('/dashboard')
                ? 'text-white'
                : 'text-[#C1C1C1]'
            }
            onClick={() => handleClick('/dashboard/1')}
          />
          <ul className="ml-14 flex list-disc flex-col gap-2 marker:text-sm marker:text-[#C1C1C1]">
            <li>
              <Asidetab
                label="대쉬보드"
                className={
                  activeMenu === '/dashboard/1'
                    ? 'text-white'
                    : 'text-[#C1C1C1]'
                }
                onClick={() => handleClick('/dashboard/1')}
              />
            </li>
            <li>
              <Asidetab
                label="나의 소품샵 관리"
                className={
                  activeMenu === '/dashboard/2'
                    ? 'text-white'
                    : 'text-[#C1C1C1]'
                }
                onClick={() => handleClick('/dashboard/2')}
              />
            </li>
            <li>
              <Asidetab
                label="클래스 예약 관리"
                className={
                  activeMenu === '/dashboard/3'
                    ? 'text-white'
                    : 'text-[#C1C1C1]'
                }
                onClick={() => handleClick('/dashboard/3')}
              />
            </li>
          </ul>
        </div>

        <div className="flex flex-col gap-5">
          <Asidetab
            icon={MessageCircleMore}
            label="입점관리"
            className={
              activeMenu.startsWith('/shop') ? 'text-white' : 'text-[#C1C1C1]'
            }
            onClick={() => handleClick('/shop/1')}
          />
          <ul className="ml-14 flex list-disc flex-col gap-2 marker:text-sm marker:text-[#C1C1C1]">
            <li>
              <Asidetab
                label="작가 리스트"
                className={
                  activeMenu === '/shop/1' ? 'text-white' : 'text-[#C1C1C1]'
                }
                onClick={() => handleClick('/shop/1')}
              />
            </li>
            <li>
              <Asidetab
                label="품목 및 재고 관리"
                className={
                  activeMenu === '/shop/2' ? 'text-white' : 'text-[#C1C1C1]'
                }
                onClick={() => handleClick('/shop/2')}
              />
            </li>
            <li>
              <Asidetab
                label="계약서 관리"
                className={
                  activeMenu === '/shop/3' ? 'text-white' : 'text-[#C1C1C1]'
                }
                onClick={() => handleClick('/shop/3')}
              />
            </li>
          </ul>
        </div>

        <div className="flex flex-col gap-5">
          <Asidetab
            icon={MessageCircleMore}
            label="정산관리"
            className={
              activeMenu.startsWith('/settlement')
                ? 'text-white'
                : 'text-[#C1C1C1]'
            }
            onClick={() => handleClick('/settlement/1')}
          />
          <ul className="ml-14 flex list-disc flex-col gap-2 marker:text-sm marker:text-[#C1C1C1]">
            <li>
              <Asidetab
                label="정산금액 계산"
                className={
                  activeMenu === '/settlement/1'
                    ? 'text-white'
                    : 'text-[#C1C1C1]'
                }
                onClick={() => handleClick('/settlement/1')}
              />
            </li>
            <li>
              <Asidetab
                label="세금계산서 발행"
                className={
                  activeMenu === '/settlement/2'
                    ? 'text-white'
                    : 'text-[#C1C1C1]'
                }
                onClick={() => handleClick('/settlement/2')}
              />
            </li>
            <li>
              <Asidetab
                label="정산내역"
                className={
                  activeMenu === '/settlement/3'
                    ? 'text-white'
                    : 'text-[#C1C1C1]'
                }
                onClick={() => handleClick('/settlement/3')}
              />
            </li>
          </ul>
        </div>

        <Asidetab
          icon={MessageCircleMore}
          label="메시지"
          className={
            activeMenu.startsWith('/messages') ? 'text-white' : 'text-[#C1C1C1]'
          }
          onClick={() => handleClick('/settlement')}
        />
        <Asidetab
          icon={MessageCircleMore}
          label="개인정보"
          className={
            activeMenu.startsWith('/personal-info')
              ? 'text-white'
              : 'text-[#C1C1C1]'
          }
          onClick={() => handleClick('/settlement')}
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
