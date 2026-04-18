import { createApi } from '@reduxjs/toolkit/query/react';

import type { ApiResponse } from '../../../shared/types';
import { createBaseQuery } from '../../../shared/constants';

import { AUTH_ENDPOINTS } from '../constants/auth-constants';
import type { AuthUser } from '../types/auth-types';
import { clearAuth, setAccessToken, setUser } from '../slices/auth-slice';

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
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setUser(data));
        } catch {
          dispatch(clearAuth());
        }
      },
    }),

    // 앱 시작 시 세션 복구
    refreshTokenOnInit: builder.query<{ accessToken: string }, void>({
      query: () => ({
        url: AUTH_ENDPOINTS.REFRESH_TOKEN,
        method: 'POST',
      }),
      transformResponse: (response: ApiResponse<{ accessToken: string }>) =>
        response.data,
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setAccessToken(data.accessToken));
        } catch {
          // 세션 없음 = 비로그인 상태로 조용히 처리
          dispatch(clearAuth());
        }
      },
    }),

    // OAuth 콜백 후 토큰 갱신용
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
    }),
  }),
});

export const {
  useGetCurrentUserQuery,
  useRefreshTokenOnInitQuery,
  useRefreshTokenMutation,
  useLogoutMutation,
} = authApi;
