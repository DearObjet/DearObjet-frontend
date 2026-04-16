import { Link, NavLink } from 'react-router';
import { useSelector } from 'react-redux';

import type { RootState } from '../../../app/store';
import { ROUTES, NAV_ITEMS, USER_ROLE } from '../../constants';

import { Button } from '../ui';

import DearObjetBlackLogo from '../../../assets/dear-objet-black-logo.svg';
import UserRoundIcon from '../../../assets/user-round.svg';
import { useAppDispatch } from '../../../app/hooks';
import { useLogoutMutation, clearAuth } from '../../../features/auth';
import { UserPlus } from 'lucide-react';

export const Header = () => {
  const dispatch = useAppDispatch();
  const [logout] = useLogoutMutation();
  const user = useSelector((state: RootState) => state.auth.user);

  const handleLogout = async () => {
    try {
      await logout().unwrap();
    } catch {
      // 서버 에러여도 클라이언트 상태는 초기화
    } finally {
      dispatch(clearAuth());
    }
  };

  return (
    <header className="w-full">
      <div
        className="h-[2.625rem] w-full bg-theme-900"
        role="presentation"
        aria-hidden="true"
      />

      {/* 메인 헤더 */}
      <div className="border-b border-theme-200">
        <div className="mx-auto mb-[0.5625rem] mt-[0.4375rem] flex max-w-[120rem] items-center px-[19.469rem]">
          {/* 로고 */}
          <Link to="/" aria-label="Dear Objet" className="shrink-0">
            <img
              src={DearObjetBlackLogo}
              alt="Dear Objet"
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
          <div className="flex w-[9rem] shrink-0 items-center justify-center gap-2">
            {user && (
              <>
                {user.role !== USER_ROLE.TEMP ? (
                  <Link
                    to={ROUTES.MY}
                    aria-label="마이페이지"
                    className="flex h-12 w-12 items-center justify-center rounded-full transition-colors duration-150 hover:bg-theme-200"
                  >
                    <img
                      src={UserRoundIcon}
                      alt=""
                      width={24}
                      className="h-6"
                    />
                  </Link>
                ) : (
                  <Link
                    to={ROUTES.SIGNUP}
                    aria-label="회원가입 페이지 이동"
                    className="flex h-12 w-12 items-center justify-center rounded-full text-xs transition-colors duration-150 hover:bg-theme-200"
                  >
                    <UserPlus className="flex h-6 w-6 text-theme-900" />
                  </Link>
                )}
                <Button
                  label="로그아웃"
                  variant="secondaryLight"
                  onClick={handleLogout}
                  size="small"
                  type="button"
                />
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
