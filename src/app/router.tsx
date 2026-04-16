import { createBrowserRouter } from 'react-router';

import { ROUTES, USER_ROLE } from '../shared/constants';
import { PublicOnlyRoute } from '../shared/components/route';
import { ProtectedRoute } from '../shared/components/route';
import { RoleGuard } from '../shared/components/route';
import { TempOrGuestRoute } from '../shared/components/route';
import {
  MainLayout,
  PartnerLayout,
  AdminLayout,
} from '../shared/components/layout';

import { OAuthCallback } from '../features/auth';
import { Signup } from '../features/signup';
import { CustomerNotice, PartnerNotice } from '../features/notice';
import { MyPage } from '../features/my-page/pages/my-page';
import { MyProfile } from '../features/my-page/components/myprofile';
import { MyBookMarks } from '../features/my-page/components/mybookmarks';
import { MyReservations } from '../features/my-page/components/myreservations';
import { MyPosts } from '../features/my-page/components/myposts';
import { MyMessages } from '../features/my-page/components/mymessages';
import { ArtistProfile } from '../features/my-page/pages/artist-profile';
import { ShopProfile } from '../features/my-page/pages/shop-profile';
import { ArtistSettingPage } from '../features/artist/setting/pages/artist-setting-page';
import { ShopSettingPage } from '../features/shop/setting/pages/shop-setting-page';
import { ThemeCustomizer } from '../features/admin/theme';
import { ShopManagement } from '../features/shop/shop-management/pages/shop-management';
import { HomePage } from '../pages/home/home-page';

export const router = createBrowserRouter([
  // 비로그인 전용
  {
    element: <PublicOnlyRoute />,
    children: [{ path: ROUTES.OAUTH_CALLBACK, element: <OAuthCallback /> }],
  },

  // 비로그인 또는 TEMP만 접근 가능
  {
    element: <TempOrGuestRoute />,
    children: [{ path: ROUTES.SIGNUP, element: <Signup /> }],
  },

  // MainLayout (모든 사용자 접근 가능)
  {
    element: <MainLayout />,
    children: [
      { path: ROUTES.HOME, element: <HomePage /> },
      { path: ROUTES.NOTICES, element: <CustomerNotice /> },
      { path: ROUTES.MAP, element: <div>지도</div> },
      { path: ROUTES.POSTS, element: <div>포스트</div> },
      { path: ROUTES.ARTISTS, element: <div>작가</div> },

      // customer, shop, artist, admin 접근 가능 (temp 제외)
      { path: ROUTES.MY, element: <MyPage /> },
      { path: ROUTES.MY_PROFILE, element: <MyProfile /> },
      { path: ROUTES.ARTIST_PROFILE, element: <ArtistProfile /> },
      { path: ROUTES.SHOP_PROFILE, element: <ShopProfile /> },

      {
        element: <ProtectedRoute />,
        children: [
          {
            element: (
              <RoleGuard
                allowedRoles={[
                  USER_ROLE.CUSTOMER,
                  USER_ROLE.SHOP,
                  USER_ROLE.ARTIST,
                  USER_ROLE.ADMIN,
                ]}
              />
            ),
            children: [
              { path: ROUTES.MY, element: <MyPage /> },
              { path: ROUTES.MY_PROFILE, element: <MyProfile /> },
              { path: ROUTES.MY_BOOKMARKS, element: <MyBookMarks /> },
              { path: ROUTES.MY_RESERVATIONS, element: <MyReservations /> },
              { path: ROUTES.MY_POSTS, element: <MyPosts /> },
              { path: ROUTES.MY_MESSAGES, element: <MyMessages /> },
            ],
          },
        ],
      },
    ],
  },

  // PartnerLayout (shop, artist만 접근 가능)
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: (
          <RoleGuard allowedRoles={[USER_ROLE.SHOP, USER_ROLE.ARTIST]} />
        ),
        children: [
          {
            element: <PartnerLayout />,
            children: [
              // shop
              {
                path: ROUTES.SHOP_DASHBOARD,
                element: <div>소품샵 대시보드</div>,
              },
              { path: ROUTES.SHOP_MANAGE, element: <ShopManagement /> },
              {
                path: ROUTES.SHOP_MANAGE_RESERVATIONS,
                element: <div>예약 관리</div>,
              },
              { path: ROUTES.SHOP_ARTISTS, element: <div>작가 관리</div> },
              { path: ROUTES.SHOP_INVENTORY, element: <div>재고 관리</div> },
              { path: ROUTES.SHOP_CONTRACTS, element: <div>계약 관리</div> },
              { path: ROUTES.SHOP_SETTLEMENTS, element: <div>정산</div> },
              { path: ROUTES.SHOP_MESSAGES, element: <div>메시지</div> },
              { path: ROUTES.SHOP_PROFILE, element: <ShopProfile /> },
              { path: ROUTES.SHOP_NOTICES, element: <PartnerNotice /> },
              {
                path: ROUTES.SHOP_NOTICE_DETAIL,
                element: <div>소품샵 공지 상세</div>,
              },
              { path: ROUTES.SHOP_SETTINGS, element: <ShopSettingPage /> },

              // artist
              {
                path: ROUTES.ARTIST_DASHBOARD,
                element: <div>작가 대시보드</div>,
              },
              {
                path: ROUTES.ARTIST_INVENTORY,
                element: <div>작가 재고 관리</div>,
              },
              { path: ROUTES.ARTIST_SHOPS, element: <div>소품샵 목록</div> },
              { path: ROUTES.ARTIST_SHIPMENTS, element: <div>배송 관리</div> },
              { path: ROUTES.ARTIST_SETTLEMENTS, element: <div>정산</div> },
              {
                path: ROUTES.ARTIST_SETTLEMENTS_HISTORY,
                element: <div>정산 내역</div>,
              },
              { path: ROUTES.ARTIST_MESSAGES, element: <div>메시지</div> },
              { path: ROUTES.ARTIST_PROFILE, element: <ArtistProfile /> },
              { path: ROUTES.ARTIST_NOTICES, element: <div>작가 공지</div> },
              {
                path: ROUTES.ARTIST_NOTICE_DETAIL,
                element: <PartnerNotice />,
              },
              { path: ROUTES.ARTIST_SETTINGS, element: <ArtistSettingPage /> },
            ],
          },
        ],
      },
    ],
  },

  // AdminLayout (admin만 접근 가능)
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <RoleGuard allowedRoles={[USER_ROLE.ADMIN]} />,
        children: [
          {
            element: <AdminLayout />,
            children: [{ path: ROUTES.ADMIN, element: <ThemeCustomizer /> }],
          },
        ],
      },
    ],
  },
]);
