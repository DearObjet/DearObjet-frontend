import { configureStore } from '@reduxjs/toolkit';

import signupReducer from '../features/signup/slices/signup-slice';
import signupAddressReducer from '../features/signup/slices/signup-address-slice';
import themeReducer from '../features/admin/theme/slices/theme-slice';
import authReducer from '../features/auth/slices/auth-slice';
import chatReducer from '../features/chat/slices/chat-slice';
import { themeApi } from '../features/admin/theme';
import { authApi } from '../features/auth';
import { noticeApi } from '../features/notice';
import { signupApi } from '../features/signup';
import {
  businessHoursApi,
  classApi,
  storyApi,
} from '../features/shop/shop-management';
import { postApi } from '../features/post';
import { mapApi } from '../features/map';
import { chatApi } from '../features/chat/api/chat-api';
import { myPageApi } from '../features/my-page/api/my-page-api';
import { classReservationApi } from '../features/shop/class-reservation-management/api/class-reservation-api';
import { userMeApi } from '../shared/components/layout/aside/api/user-me-api';
import { inboundApi } from '../features/shop/inbound-management/api/inbound-api';
import { outboundApi } from '../features/artist/outbound-management';
import { artistProductApi } from '../features/artist/inventory-management';
import { artistTenantApi } from '../features/tenant-management/api/artist-tenant-api';
import { artistPageApi } from '../features/artist-page/api/artist-page-api';
import { festivalApi } from '../features/festival/api/festival-api';
import { contractManagementApi } from '../features/contract-management/api/contract-management-api';

export const store = configureStore({
  reducer: {
    signup: signupReducer,
    signupAddress: signupAddressReducer,
    theme: themeReducer,
    auth: authReducer,
    chat: chatReducer,
    [themeApi.reducerPath]: themeApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [noticeApi.reducerPath]: noticeApi.reducer,
    [postApi.reducerPath]: postApi.reducer,
    [signupApi.reducerPath]: signupApi.reducer,
    [classApi.reducerPath]: classApi.reducer,
    [storyApi.reducerPath]: storyApi.reducer,
    [businessHoursApi.reducerPath]: businessHoursApi.reducer,
    [mapApi.reducerPath]: mapApi.reducer,
    [chatApi.reducerPath]: chatApi.reducer,
    [myPageApi.reducerPath]: myPageApi.reducer,
    [userMeApi.reducerPath]: userMeApi.reducer,
    [inboundApi.reducerPath]: inboundApi.reducer,
    [outboundApi.reducerPath]: outboundApi.reducer,
    [classReservationApi.reducerPath]: classReservationApi.reducer,
    [artistProductApi.reducerPath]: artistProductApi.reducer,
    [artistTenantApi.reducerPath]: artistTenantApi.reducer,
    [artistPageApi.reducerPath]: artistPageApi.reducer,
    [festivalApi.reducerPath]: festivalApi.reducer,
    [contractManagementApi.reducerPath]: contractManagementApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(themeApi.middleware)
      .concat(authApi.middleware)
      .concat(noticeApi.middleware)
      .concat(postApi.middleware)
      .concat(signupApi.middleware)
      .concat(classApi.middleware)
      .concat(storyApi.middleware)
      .concat(businessHoursApi.middleware)
      .concat(mapApi.middleware)
      .concat(chatApi.middleware)
      .concat(myPageApi.middleware)
      .concat(userMeApi.middleware)
      .concat(classReservationApi.middleware)
      .concat(inboundApi.middleware)
      .concat(outboundApi.middleware)
      .concat(artistProductApi.middleware)
      .concat(artistTenantApi.middleware)
      .concat(artistPageApi.middleware)
      .concat(festivalApi.middleware)
      .concat(contractManagementApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
