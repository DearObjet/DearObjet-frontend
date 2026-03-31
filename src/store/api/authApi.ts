import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import type { RootState } from '../index';
import type { AuthUser, CompleteSignupRequest } from '../../types/authTypes';
import type { ApiResponse } from '../../types/apiTypes';

const API_BASE_URL = import.meta.env.VITE_BASE_URL;

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
    // 현재 사용자 최소 정보 조회
    getCurrentUser: builder.query<AuthUser, void>({
      query: () => '/users/me',
      transformResponse: (response: ApiResponse<AuthUser>) => response.data,
      providesTags: ['Auth'],
    }),

    // 회원가입 완료
    completeSignup: builder.mutation<void, CompleteSignupRequest>({
      query: (data) => ({
        url: '/users/complete', // 수정 필요
        method: 'POST',
        body: data,
      }),
      transformResponse: (response: ApiResponse<void>) => response.data,
      invalidatesTags: ['Auth'],
    }),

    // Access Token 발급
    refreshToken: builder.mutation<{ accessToken: string }, void>({
      query: () => ({
        url: '/auth/token/refresh',
        method: 'POST',
      }),
      transformResponse: (response: ApiResponse<{ accessToken: string }>) =>
        response.data,
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
  useGetCurrentUserQuery,
  useCompleteSignupMutation,
  useRefreshTokenMutation,
  useLogoutMutation,
} = authApi;
