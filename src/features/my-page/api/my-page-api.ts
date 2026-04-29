import { createApi } from '@reduxjs/toolkit/query/react';
import { createBaseQuery } from '../../../shared/constants';
import type { ApiResponse } from '../../../shared/types';

const MY_PAGE_ENDPOINTS = {
  PROFILE: '/users/me/profile',
} as const;

interface UserProfile {
  name: string;
  phoneNumber: string;
  email: string;
  profileImageUrl: string;
  smsAgreement: boolean;
  marketingAgreement: boolean;
}

interface UpdateProfileRequest {
  name: string;
  phoneNumber: string;
  smsAgreement: boolean;
  marketingAgreement: boolean;
  profileImage?: File;
}

export const myPageApi = createApi({
  reducerPath: 'myPageApi',
  baseQuery: createBaseQuery(),
  tagTypes: ['Profile'],
  endpoints: (builder) => ({
    getProfile: builder.query<UserProfile, void>({
      query: () => MY_PAGE_ENDPOINTS.PROFILE,
      transformResponse: (response: ApiResponse<UserProfile>) => response.data,
      providesTags: ['Profile'],
    }),

    updateProfile: builder.mutation<UserProfile, UpdateProfileRequest>({
      query: ({ profileImage, ...body }) => {
        const formData = new FormData();
        formData.append(
          'request',
          new Blob([JSON.stringify(body)], { type: 'application/json' })
        );
        if (profileImage) {
          formData.append('profileImage', profileImage);
        }
        return {
          url: MY_PAGE_ENDPOINTS.PROFILE,
          method: 'PATCH',
          body: formData,
        };
      },
      transformResponse: (response: ApiResponse<UserProfile>) => response.data,
      invalidatesTags: ['Profile'],
    }),
  }),
});

export const { useGetProfileQuery, useUpdateProfileMutation } = myPageApi;
