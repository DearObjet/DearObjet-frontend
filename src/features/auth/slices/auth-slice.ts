import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { AuthUser } from '../types/auth-types';

interface AuthState {
  accessToken: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  signupRequired: boolean;
}

const initialState: AuthState = {
  accessToken: localStorage.getItem('accessToken'),
  user: localStorage.getItem('user')
    ? JSON.parse(localStorage.getItem('user')!)
    : null,
  isAuthenticated: !!localStorage.getItem('accessToken'),
  signupRequired: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem('accessToken', action.payload);
    },

    setUser: (state, action: PayloadAction<AuthUser>) => {
      state.user = action.payload;
      localStorage.setItem('user', JSON.stringify(action.payload));
    },

    setSignupRequired: (state, action: PayloadAction<boolean>) => {
      state.signupRequired = action.payload;
    },
  },
});

export const { setAccessToken, setUser, setSignupRequired } = authSlice.actions;
export default authSlice.reducer;
