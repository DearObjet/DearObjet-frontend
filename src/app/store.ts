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
import { classApi } from '../features/shop/shop-management/api/class-api';
import { mapApi, oneDayClassApi } from '../features/map';
import { chatApi } from '../features/chat/api/chat-api';

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
    [mapApi.reducerPath]: mapApi.reducer,
    [oneDayClassApi.reducerPath]: oneDayClassApi.reducer,
    [chatApi.reducerPath]: chatApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(themeApi.middleware)
      .concat(authApi.middleware)
      .concat(noticeApi.middleware)
      .concat(signupApi.middleware)
      .concat(classApi.middleware)
      .concat(mapApi.middleware)
      .concat(oneDayClassApi.middleware)
      .concat(chatApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
