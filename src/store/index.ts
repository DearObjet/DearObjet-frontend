import { configureStore } from '@reduxjs/toolkit';
import signupReducer from './slices/signup-slice';
import signupAddressReducer from './slices/signup-address-slice';
import themeReducer from './slices/themeSlice';
import { themeApi } from './api/themeApi';

export const store = configureStore({
  reducer: {
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
