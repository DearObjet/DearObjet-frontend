import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { User } from '../store/slices/auth-slice';
import type { RootState } from '../store';

const API_BASE_URL =
  import.meta.env.REACT_APP_API_URL || 'http://localhost:3000/api'; // 임시코드

export interface LoginRequest {
  id: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface VerifyResponse {
  user: User;
}

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      // Redux state에서 토큰 가져오기
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // 로그인
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    // 토큰 검증
    verifyToken: builder.query<VerifyResponse, string>({
      query: (token) => ({
        url: '/auth/verify',
        headers: {
          authorization: `Bearer ${token}`,
        },
      }),
    }),
    // 로그아웃 (서버에 알림)
    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useVerifyTokenQuery,
  useLazyVerifyTokenQuery,
  useLogoutMutation,
} = authApi;
