import { createApi } from '@reduxjs/toolkit/query/react';
import { createBaseQuery } from '../../../shared/constants';
import type { ApiResponse } from '../../../shared/types';

const MY_PAGE_ENDPOINTS = {
  PROFILE: '/users/me/profile',
  SEND_PHONE_VERIFICATION: '/auth/phone-verifications/send',
  VERIFY_PHONE: '/auth/phone-verifications/verify',
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

interface SendPhoneVerificationRequest {
  phoneNumber: string;
}

interface SendPhoneVerificationResponse {
  message?: string;
}

interface VerifyPhoneRequest {
  phoneNumber: string;
  code: string;
}

interface VerifyPhoneResponse {
  verified: boolean;
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

    sendPhoneVerification: builder.mutation<
      SendPhoneVerificationResponse,
      SendPhoneVerificationRequest
    >({
      query: (data) => ({
        url: MY_PAGE_ENDPOINTS.SEND_PHONE_VERIFICATION,
        method: 'POST',
        body: data,
      }),
      transformResponse: (
        response: ApiResponse<SendPhoneVerificationResponse>
      ) => response.data,
    }),

    verifyPhone: builder.mutation<VerifyPhoneResponse, VerifyPhoneRequest>({
      query: (data) => ({
        url: MY_PAGE_ENDPOINTS.VERIFY_PHONE,
        method: 'POST',
        body: data,
      }),
      transformResponse: (response: ApiResponse<VerifyPhoneResponse>) =>
        response.data,
    }),
  }),
});

export const {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useSendPhoneVerificationMutation,
  useVerifyPhoneMutation,
} = myPageApi;
