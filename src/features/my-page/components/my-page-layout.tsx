import { NavLink } from 'react-router';
import type { ReactNode } from 'react';

import { ROUTES } from '../../../shared/constants';

const NAV_ITEMS = [
  { label: '내가 찜한 소품샵', to: ROUTES.MY_BOOKMARKS },
  { label: '내정보', to: ROUTES.MY_PROFILE },
  { label: '예약내역', to: ROUTES.MY_RESERVATIONS },
  { label: '내가 작성한 글', to: ROUTES.MY_POSTS },
  { label: '메시지', to: ROUTES.MY_MESSAGES },
];

export const MyPageLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex gap-9">
      <aside className="flex flex-col gap-4">
        <div className="flex h-[11.25rem] w-[22.375rem] items-center gap-5 rounded-[10px] border px-8">
          <img
            src=""
            alt="내 프로필 이미지"
            className="borde r h-[5.625rem] w-[5.625rem] rounded-full"
          />
          <div>
            <p>남현정</p>
            <p>아이디</p>
          </div>
        </div>

        <nav className="h-[26.5625rem] w-[22.375rem] border px-[2.9375rem] py-[4.1875rem]">
          <ul className="flex flex-col gap-[2.125rem]">
            {NAV_ITEMS.map(({ label, to }) => (
              <li key={to}>
                <NavLink to={to} className="text-black hover:text-black">
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      <div>{children}</div>
    </div>
  );
};
