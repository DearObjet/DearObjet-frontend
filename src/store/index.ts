import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './slices/counterSlice'; // 예시 import
import signupReducer from './slices/signup-slice';
import signupAddressReducer from './slices/signup-address-slice';
import authReducer from './slices/auth-slice';
import { authApi } from '../utils/auth-api';

export const store = configureStore({
  reducer: {
    counter: counterReducer, // 예시
    signup: signupReducer,
    signupAddress: signupAddressReducer,
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
