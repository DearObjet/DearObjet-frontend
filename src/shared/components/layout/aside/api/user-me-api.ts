import { createApi } from '@reduxjs/toolkit/query/react';

import { createBaseQuery } from '../../../../constants';
import type { ApiResponse } from '../../../../types';

const USER_ENDPOINTS = {
  ME: '/users/me',
} as const;

interface UserMe {
  userId: number;
  email: string;
  name: string;
  profileUrl: string | null;
  role: string;
}

export const userMeApi = createApi({
  reducerPath: 'userMeApi',
  baseQuery: createBaseQuery(),
  endpoints: (builder) => ({
    getMe: builder.query<UserMe, void>({
      query: () => USER_ENDPOINTS.ME,
      transformResponse: (response: ApiResponse<UserMe>) => response.data,
    }),
  }),
});

export const { useGetMeQuery } = userMeApi;
