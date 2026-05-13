import { createBrowserRouter } from 'react-router';

import { ROUTES, USER_ROLE } from '../shared/constants';
import {
  ProtectedRoute,
  RoleGuard,
  TempOrGuestRoute,
} from '../shared/components/route';
import {
  MainLayout,
  PartnerLayout,
  AdminLayout,
  MapLayout,
} from '../shared/components/layout';

import { OAuthCallback } from '../features/auth';
import { Signup } from '../features/signup';
import { CustomerNotice, PartnerNotice } from '../features/notice';
import { PartnerProfile } from '../features/my-page/pages/partner-profile';
import { ThemeCustomizer } from '../features/admin/theme';
import { ShopManagement } from '../features/shop/shop-management';
import { ClassReservation } from '../features/shop/class-reservation-management/pages/class-reservation';
import { HomePage } from '../pages/home/home-page';
import { Map } from '../features/map';
import { Post } from '../features/post';
import { MyPage } from '../features/my-page/pages/my-page';
import { ShopSettingPage } from '../features/shop/setting/pages/shop-setting-page';
import { ArtistSettingPage } from '../features/artist/setting/pages/artist-setting-page';
import { Chat } from '../features/chat/pages/chat';
import { InventoryManagement } from '../features/artist/inventory-management/pages/inventory-mangement';
import { OutboundManagement } from '../features/artist/outbound-management';
import { InboundManagement } from '../features/shop/inbound-management';
import { ArtistTenantManagement } from '../features/tenant-management/pages/artist-tenant-management';
import { ShopTenantManagement } from '../features/tenant-management/pages/shop-tenant-management';
import { ContractManagement } from '../features/contract-management/pages/contract-management';
import { SettlementHistory } from '../features/settlement-hisotry';
import { ArtistPage } from '../features/artist-page/pages/artist-page';

export const router = createBrowserRouter([
  {
    children: [{ path: ROUTES.OAUTH_CALLBACK, element: <OAuthCallback /> }],
  },

  // 비로그인 또는 TEMP만 접근 가능
  {
    element: <TempOrGuestRoute />,
    children: [
      {
        element: <MainLayout />,
        children: [{ path: ROUTES.SIGNUP, element: <Signup /> }],
      },
    ],
  },

  // MainLayout
  {
    element: <MainLayout />,
    // 모든 사용자 접근 가능
    children: [
      { path: ROUTES.HOME, element: <HomePage /> },
      { path: ROUTES.NOTICES, element: <CustomerNotice /> },
      { path: ROUTES.POSTS, element: <Post /> },
      { path: ROUTES.ARTISTS, element: <ArtistPage /> },

      // customer만 접근 가능
      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <RoleGuard allowedRoles={[USER_ROLE.CUSTOMER]} />,
            children: [{ path: ROUTES.MY, element: <MyPage /> }],
          },
        ],
      },
    ],
  },

  // MapLayout (모든 사용자 접근 가능)
  {
    element: <MapLayout />,
    children: [{ path: ROUTES.MAP, element: <Map /> }],
  },

  // PartnerLayout
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <PartnerLayout />,
        children: [
          // shop만 접근 가능
          {
            element: <RoleGuard allowedRoles={[USER_ROLE.SHOP]} />,
            children: [
              {
                path: ROUTES.SHOP_DASHBOARD,
                element: <div>소품샵 대시보드</div>,
              },
              { path: ROUTES.SHOP_MANAGE, element: <ShopManagement /> },
              {
                path: ROUTES.SHOP_MANAGE_RESERVATIONS,
                element: <ClassReservation />,
              },
              {
                path: ROUTES.SHOP_ARTISTS,
                element: <ArtistTenantManagement />,
              },
              { path: ROUTES.SHOP_INVENTORY, element: <InboundManagement /> },
              { path: ROUTES.SHOP_CONTRACTS, element: <ContractManagement /> },
              {
                path: ROUTES.SHOP_SETTLEMENTS,
                element: <div>정산금액 계산</div>,
              },
              {
                path: ROUTES.SHOP_SETTLEMENTS_HISTORY,
                element: <SettlementHistory />,
              },
              { path: ROUTES.SHOP_MESSAGES, element: <Chat /> },
              { path: ROUTES.SHOP_PROFILE, element: <PartnerProfile /> },
              { path: ROUTES.SHOP_NOTICES, element: <PartnerNotice /> },
              {
                path: ROUTES.SHOP_NOTICE_DETAIL,
                element: <div>소품샵 공지 상세</div>,
              },
              { path: ROUTES.SHOP_SETTINGS, element: <ShopSettingPage /> },
            ],
          },

          // artist만 접근 가능
          {
            element: <RoleGuard allowedRoles={[USER_ROLE.ARTIST]} />,
            children: [
              {
                path: ROUTES.ARTIST_DASHBOARD,
                element: <div>작가 대시보드</div>,
              },
              {
                path: ROUTES.ARTIST_INVENTORY,
                element: <InventoryManagement />,
              },
              {
                path: ROUTES.ARTIST_SHOPS,
                element: <ShopTenantManagement />,
              },
              {
                path: ROUTES.ARTIST_SHIPMENTS,
                element: <OutboundManagement />,
              },
              {
                path: ROUTES.ARTIST_CONTRACTS,
                element: <ContractManagement />,
              },
              { path: ROUTES.ARTIST_SETTLEMENTS, element: <div>정산</div> },
              {
                path: ROUTES.ARTIST_SETTLEMENTS_HISTORY,
                element: <SettlementHistory />,
              },
              { path: ROUTES.ARTIST_MESSAGES, element: <Chat /> },
              { path: ROUTES.ARTIST_PROFILE, element: <PartnerProfile /> },
              { path: ROUTES.ARTIST_NOTICES, element: <PartnerNotice /> },
              { path: ROUTES.ARTIST_NOTICE_DETAIL, element: <PartnerNotice /> },
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
