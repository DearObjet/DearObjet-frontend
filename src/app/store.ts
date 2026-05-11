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
import { mapApi, oneDayClassApi, mapStoryApi } from '../features/map';
import { chatApi } from '../features/chat/api/chat-api';
import { myPageApi } from '../features/my-page/api/my-page-api';
import { classReservationApi } from '../features/shop/class-reservation-management/api/class-reservation-api';
import { userMeApi } from '../shared/components/layout/aside/api/user-me-api';

import { inboundApi } from '../features/shop/inbound-management/api/inbound-api';
import { outboundApi } from '../features/artist/outbound-management/api/outbound-api';

import { artistTenantApi } from '../features/shop/tenant-management/api/artist-tenant-api';

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
    [signupApi.reducerPath]: signupApi.reducer,
    [classApi.reducerPath]: classApi.reducer,
    [storyApi.reducerPath]: storyApi.reducer,
    [businessHoursApi.reducerPath]: businessHoursApi.reducer,
    [mapApi.reducerPath]: mapApi.reducer,
    [oneDayClassApi.reducerPath]: oneDayClassApi.reducer,
    [mapStoryApi.reducerPath]: mapStoryApi.reducer,
    [chatApi.reducerPath]: chatApi.reducer,
    [myPageApi.reducerPath]: myPageApi.reducer,
    [userMeApi.reducerPath]: userMeApi.reducer,
    [inboundApi.reducerPath]: inboundApi.reducer,
    [outboundApi.reducerPath]: outboundApi.reducer,
    [classReservationApi.reducerPath]: classReservationApi.reducer,
    [artistTenantApi.reducerPath]: artistTenantApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(themeApi.middleware)
      .concat(authApi.middleware)
      .concat(noticeApi.middleware)
      .concat(signupApi.middleware)
      .concat(classApi.middleware)
      .concat(storyApi.middleware)
      .concat(businessHoursApi.middleware)
      .concat(mapApi.middleware)
      .concat(oneDayClassApi.middleware)
      .concat(mapStoryApi.middleware)
      .concat(chatApi.middleware)
      .concat(myPageApi.middleware)
      .concat(userMeApi.middleware)
      .concat(classReservationApi.middleware)
      .concat(inboundApi.middleware)
      .concat(outboundApi.middleware)
      .concat(artistTenantApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
