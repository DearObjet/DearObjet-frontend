import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { CompleteSignupRequest } from '../../types/authTypes';
import type { RootState } from '../index';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.accessToken;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Auth'],
  endpoints: (builder) => ({
    // 회원가입 완료
    completeSignup: builder.mutation<void, CompleteSignupRequest>({
      query: (data) => ({
        url: '/users/complete', // 수정 필요
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Auth'],
    }),

    // Access Token 갱신
    refreshToken: builder.mutation<{ accessToken: string }, void>({
      query: () => ({
        url: '/auth/token/refresh',
        method: 'POST',
      }),
    }),

    // 로그아웃
    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
    }),
  }),
});

export const {
  useCompleteSignupMutation,
  useRefreshTokenMutation,
  useLogoutMutation,
} = authApi;
