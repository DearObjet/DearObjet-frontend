import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
  CompleteSignupRequest,
  CompleteBusinessSignupRequest,
} from '../../types/authTypes';
import type { RootState } from '../index';
import type { ApiResponse } from '../../types/apiTypes';

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
    // 일반회원 가입
    completeSignup: builder.mutation<void, CompleteSignupRequest>({
      query: (data) => ({
        url: '/users/complete',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Auth'],
      // transformResponse: (response: ApiResponse<void>) => response.data,
    }),

    // 소품샵 가입
    completeShopSignup: builder.mutation<
      void,
      { request: CompleteBusinessSignupRequest; businessLicenseFile: File }
    >({
      query: ({ request, businessLicenseFile }) => {
        const formData = new FormData();
        formData.append(
          'request',
          new Blob([JSON.stringify(request)], { type: 'application/json' })
        );
        formData.append('businessLicenseFile', businessLicenseFile);
        return {
          url: '/users/complete/shop',
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: ['Auth'],
    }),

    // 작가 가입
    completeArtistSignup: builder.mutation<
      void,
      { request: CompleteBusinessSignupRequest; businessLicenseFile: File }
    >({
      query: ({ request, businessLicenseFile }) => {
        const formData = new FormData();
        formData.append(
          'request',
          new Blob([JSON.stringify(request)], { type: 'application/json' })
        );
        formData.append('businessLicenseFile', businessLicenseFile);
        return {
          url: '/users/complete/artist',
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: ['Auth'],
    }),

    // Access Token 갱신
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
  useCompleteSignupMutation,
  useCompleteShopSignupMutation,
  useCompleteArtistSignupMutation,
  useRefreshTokenMutation,
  useLogoutMutation,
} = authApi;
