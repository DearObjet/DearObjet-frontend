import { Navigate, Outlet } from 'react-router';
import { useSelector } from 'react-redux';

import type { RootState } from '../../../app/store';

import { ROUTES, USER_ROLE } from '../../constants';

/**
 * 비로그인 또는 TEMP 사용자만 접근 가능한 라우트
 * TEMP 이외의 로그인 사용자는 홈으로 리다이렉트
 */
export const TempOrGuestRoute = () => {
  const user = useSelector((state: RootState) => state.auth.user);

  if (user && user.role !== USER_ROLE.TEMP) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  return <Outlet />;
};
