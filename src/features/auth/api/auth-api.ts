import { createApi } from '@reduxjs/toolkit/query/react';

import type { ApiResponse } from '../../../shared/types';
import { createBaseQuery } from '../../../shared/constants';

import { AUTH_ENDPOINTS } from '../constants/auth-constants';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: createBaseQuery(),
  tagTypes: ['Auth'],
  endpoints: (builder) => ({
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
    }),
  }),
});

export const { useRefreshTokenMutation, useLogoutMutation } = authApi;
