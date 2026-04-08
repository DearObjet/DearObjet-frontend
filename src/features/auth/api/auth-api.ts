import { createApi } from '@reduxjs/toolkit/query/react';

import type { ApiResponse } from '../../../shared/types';
import { createBaseQuery } from '../../../shared/constants';

import { AUTH_ENDPOINTS } from '../constants/auth-constants';
import type { AuthUser } from '../types/auth-types';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: createBaseQuery(),
  tagTypes: ['Auth'],
  endpoints: (builder) => ({
    // 현재 사용자 최소 정보 조회
    getCurrentUser: builder.query<AuthUser, void>({
      query: () => AUTH_ENDPOINTS.GET_CURRENT_USER,
      transformResponse: (response: ApiResponse<AuthUser>) => response.data,
      providesTags: ['Auth'],
    }),

    // 앱 시작 시 세션 복구
    refreshTokenOnInit: builder.query<{ accessToken: string }, void>({
      query: () => ({
        url: AUTH_ENDPOINTS.REFRESH_TOKEN,
        method: 'POST',
      }),
      transformResponse: (response: ApiResponse<{ accessToken: string }>) =>
        response.data,
    }),

    // Access Token 갱신
    refreshToken: builder.mutation<{ accessToken: string }, void>({
      query: () => ({
        url: AUTH_ENDPOINTS.REFRESH_TOKEN,
        method: 'POST',
      }),
      transformResponse: (response: ApiResponse<{ accessToken: string }>) =>
        response.data,
    }),

    // 로그아웃
    logout: builder.mutation<void, void>({
      query: () => ({
        url: AUTH_ENDPOINTS.LOGOUT,
        method: 'POST',
      }),
      invalidatesTags: ['Auth'],
    }),
  }),
});

export const {
  useGetCurrentUserQuery,
  useRefreshTokenOnInitQuery,
  useRefreshTokenMutation,
  useLogoutMutation,
} = authApi;
