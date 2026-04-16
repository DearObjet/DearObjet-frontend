import { Navigate } from 'react-router';

import { ROUTES } from '../../../shared/constants';

export const MyPage = () => {
  return <Navigate to={ROUTES.MY_BOOKMARKS} replace />;
};
