import { Navigate, Outlet } from 'react-router';
import { useSelector } from 'react-redux';

import type { RootState } from '../../../app/store';
import { ROUTES } from '../../constants';

/**
 * 로그인한 사용자만 접근 가능한 라우트
 * 비로그인 상태에서 접근 시 홈으로 리다이렉트
 */
export const ProtectedRoute = () => {
  const user = useSelector((state: RootState) => state.auth.user);

  if (!user) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  return <Outlet />;
};
