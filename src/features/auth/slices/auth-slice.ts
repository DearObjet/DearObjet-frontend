import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { AuthUser } from '../types/auth-types';

interface AuthState {
  accessToken: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  signupRequired: boolean;
}

const initialState: AuthState = {
  accessToken: null,
  user: null,
  isAuthenticated: false,
  signupRequired: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
      state.isAuthenticated = true;
    },

    setUser: (state, action: PayloadAction<AuthUser>) => {
      state.user = action.payload;
    },

    setSignupRequired: (state, action: PayloadAction<boolean>) => {
      state.signupRequired = action.payload;
    },

    clearAuth: (state) => {
      state.accessToken = null;
      state.user = null;
      state.signupRequired = false;
    },
  },
});

export const { setAccessToken, setUser, setSignupRequired, clearAuth } =
  authSlice.actions;
export default authSlice.reducer;
