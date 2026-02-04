import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './slices/counterSlice'; // 예시 import
import signupReducer from './slices/signup-slice';
import signupAddressReducer from './slices/signup-address-slice';
import themeReducer from './slices/themeSlice';
import { themeApi } from './api/themeApi';

export const store = configureStore({
  reducer: {
    counter: counterReducer, // 예시
    signup: signupReducer,
    signupAddress: signupAddressReducer,
    theme: themeReducer,
    [themeApi.reducerPath]: themeApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(themeApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
