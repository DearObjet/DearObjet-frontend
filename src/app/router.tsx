import { createBrowserRouter } from 'react-router';

import { ROUTES } from '../shared/constants';

import { OAuthCallback } from '../features/auth';

import {
  MainLayout,
  PartnerLayout,
  AdminLayout,
} from '../shared/components/layout';
import { HomePage } from '../pages/home/home-page';
import { Signup } from '../features/signup';
import { CustomerNotice } from '../features/notice';

import { ThemeCustomizer } from '../features/admin/theme';

export const router = createBrowserRouter([
  {
    path: ROUTES.OAUTH_CALLBACK,
    element: <OAuthCallback />,
  },

  // MainLayout
  {
    element: <MainLayout />,
    children: [
      { path: ROUTES.HOME, element: <HomePage /> },
      { path: ROUTES.SIGNUP, element: <Signup /> },
      { path: ROUTES.NOTICES, element: <CustomerNotice /> },
      { path: ROUTES.MAP, element: <div>지도</div> },
      { path: ROUTES.POSTS, element: <div>포스트</div> },
      { path: ROUTES.ARTISTS, element: <div>작가</div> },
    ],
  },

  // PartnerLayout
  {
    element: <PartnerLayout />,
    children: [
      { path: ROUTES.ARTIST_DASHBOARD, element: <div>작가 대시보드</div> },
      { path: ROUTES.SHOP_DASHBOARD, element: <div>소품샵 대시보드</div> },
    ],
  },

  // AdminLayout
  {
    element: <AdminLayout />,
    children: [{ path: ROUTES.ADMIN, element: <ThemeCustomizer /> }],
  },
]);
