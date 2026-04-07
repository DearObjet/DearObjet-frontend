import { Link, NavLink } from 'react-router';
import { useSelector } from 'react-redux';

import type { RootState } from '../../../app/store';
import { ROUTES, NAV_ITEMS } from '../../constants';

import DearObjetBlackLogo from '../../../assets/dear-objet-black-logo.svg';
import UserRoundIcon from '../../../assets/user-round.svg';

export const Header = () => {
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <header className="w-full">
      <div
        className="h-[2.625rem] w-full bg-theme-900"
        role="presentation"
        aria-hidden="true"
      />

      {/* 메인 헤더 */}
      <div className="border-b border-theme-200">
        <div className="mx-[19.469rem] mb-[0.5625rem] mt-[0.4375rem] flex items-center">
          {/* 로고 */}
          <Link to="/" aria-label="Dear Objet" className="shrink-0">
            <img
              src={DearObjetBlackLogo}
              alt="Dear Objet"
              width={74}
              height={78}
              className="h-13 w-auto"
            />
          </Link>

          {/* 헤더 네비게이션 */}
          <nav
            className="flex flex-1 justify-center"
            aria-label="네비게이션 메뉴"
          >
            <ul className="flex items-center gap-9" role="list">
              {NAV_ITEMS.map(({ label, to }) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    className={({ isActive }) =>
                      [
                        'text-base font-semibold transition-colors duration-150',
                        isActive
                          ? 'text-theme-500'
                          : 'text-theme-900 hover:text-theme-500',
                      ].join(' ')
                    }
                  >
                    {label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* 유저 액션 영역 */}
          <div className="shrink-0">
            {user && (
              <Link
                to={ROUTES.MY}
                aria-label="마이페이지"
                className="flex h-12 w-12 items-center justify-center rounded-full transition-colors duration-150 hover:bg-theme-200"
              >
                <img
                  src={UserRoundIcon}
                  alt=""
                  width={24}
                  height={24}
                  className="h-6 w-auto"
                />
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
