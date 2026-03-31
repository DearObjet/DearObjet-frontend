import { configureStore } from '@reduxjs/toolkit';
import signupReducer from './slices/signup-slice';
import signupAddressReducer from './slices/signup-address-slice';
import themeReducer from './slices/themeSlice';
import authReducer from './slices/authSlice';
import { themeApi } from './api/themeApi';
import { authApi } from './api/authApi';
import { noticeApi } from './api/noticeApi';

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
