import { Navigate, Outlet } from 'react-router';
import { useSelector } from 'react-redux';

import type { RootState } from '../../../app/store';

import { ROUTES, type UserRole } from '../../constants';

interface RoleGuardProps {
  allowedRoles: UserRole[];
}

/**
 * 특정 역할만 접근 가능한 라우트
 * 허용되지 않은 역할로 접근 시 홈으로 리다이렉트
 */
export const RoleGuard = ({ allowedRoles }: RoleGuardProps) => {
  const user = useSelector((state: RootState) => state.auth.user);

  if (!user || !allowedRoles.includes(user.role as UserRole)) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  return <Outlet />;
};
