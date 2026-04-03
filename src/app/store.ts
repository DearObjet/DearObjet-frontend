import { configureStore } from '@reduxjs/toolkit';
import signupReducer from '../features/signup/slices/signup-slice';
import signupAddressReducer from '../features/signup/slices/signup-address-slice';
import themeReducer from '../features/admin/theme/slices/theme-slice';
import authReducer from '../features/auth/slices/auth-slice';
import { themeApi } from '../features/admin/theme';
import { authApi } from '../features/auth';
import { noticeApi } from '../features/notice';
import { signupApi } from '../features/signup';

export const store = configureStore({
  reducer: {
    signup: signupReducer,
    signupAddress: signupAddressReducer,
    theme: themeReducer,
    auth: authReducer,
    [themeApi.reducerPath]: themeApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [noticeApi.reducerPath]: noticeApi.reducer,
    [signupApi.reducerPath]: signupApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(themeApi.middleware)
      .concat(authApi.middleware)
      .concat(noticeApi.middleware)
      .concat(signupApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
