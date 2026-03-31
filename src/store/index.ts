import { configureStore } from '@reduxjs/toolkit';
import signupReducer from './slices/signup-slice';
import signupAddressReducer from './slices/signup-address-slice';
import themeReducer from './slices/theme-slice';
import authReducer from './slices/auth-slice';
import { themeApi } from './api/theme-api';
import { authApi } from './api/auth-api';
import { noticeApi } from './api/notice-api';

export const store = configureStore({
  reducer: {
    signup: signupReducer,
    signupAddress: signupAddressReducer,
    theme: themeReducer,
    auth: authReducer,
    [themeApi.reducerPath]: themeApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [noticeApi.reducerPath]: noticeApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(themeApi.middleware)
      .concat(authApi.middleware)
      .concat(noticeApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
