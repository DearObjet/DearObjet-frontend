import { configureStore } from '@reduxjs/toolkit';

import signupReducer from './slices/signup-slice';
import signupAddressReducer from './slices/signup-address-slice';
import themeReducer from './slices/themeSlice';
import authReducer from './slices/authSlice';
import chatReducer from './slices/chat-slice';
import { themeApi } from './api/themeApi';
import { authApi } from './api/authApi';
import { chatApi } from './api/chatApi';

export const store = configureStore({
  reducer: {
    signup: signupReducer,
    signupAddress: signupAddressReducer,
    theme: themeReducer,
    auth: authReducer,
    chat: chatReducer,
    [themeApi.reducerPath]: themeApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [chatApi.reducerPath]: chatApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(themeApi.middleware)
      .concat(authApi.middleware)
      .concat(chatApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
