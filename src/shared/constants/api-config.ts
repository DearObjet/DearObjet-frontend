import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import type { RootState } from '../../app/store';
import type { ApiResponse } from '../types';

import {
  setAccessToken,
  clearAuth,
} from '../../features/auth/slices/auth-slice';
import { AUTH_ENDPOINTS } from '../../features/auth/constants/auth-constants';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const baseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken;
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

// 동시에 여러 401이 들어와도 refresh는 한 번만 실행되도록
let isRefreshing = false;

export const createBaseQuery =
  () =>
  async (
    args: Parameters<typeof baseQuery>[0],
    api: Parameters<typeof baseQuery>[1],
    extraOptions: Parameters<typeof baseQuery>[2]
  ) => {
    let result = await baseQuery(args, api, extraOptions);

    if (result.error?.status === 401) {
      // refresh 엔드포인트 자체가 401이면 재시도 없이 clearAuth만
      const url = typeof args === 'string' ? args : args.url;
      if (url === AUTH_ENDPOINTS.REFRESH_TOKEN) {
        api.dispatch(clearAuth());
        return result;
      }

      if (isRefreshing) {
        return result;
      }

      isRefreshing = true;

      try {
        const refreshResult = await baseQuery(
          { url: AUTH_ENDPOINTS.REFRESH_TOKEN, method: 'POST' },
          api,
          extraOptions
        );

        if (refreshResult.data) {
          const { accessToken } = (
            refreshResult.data as ApiResponse<{ accessToken: string }>
          ).data;

          api.dispatch(setAccessToken(accessToken));
          result = await baseQuery(args, api, extraOptions);
        } else {
          api.dispatch(clearAuth());
          alert('로그인이 만료되었습니다. 다시 로그인해주세요.');
          window.location.reload();
        }
      } finally {
        isRefreshing = false;
      }
    }

    return result;
  };
