import { createApi } from '@reduxjs/toolkit/query/react';

import { createBaseQuery } from '../../../shared/constants';
import type { ApiResponse } from '../../../shared/types';

const MY_PAGE_ENDPOINTS = {
  PROFILE: '/users/me/profile',
  BUSINESS_PROFILE: '/users/me/business-profile',
  SEND_PHONE_VERIFICATION: '/auth/phone-verifications/send',
  VERIFY_PHONE: '/auth/phone-verifications/verify',
} as const;

interface UserProfile {
  name: string;
  phoneNumber: string;
  email: string;
  profileUrl: string;
  smsAgreement: boolean;
  marketingAgreement: boolean;
}

interface BusinessProfile {
  profileUrl: string;
  userName: string;
  phoneNumber: string;
  email: string;
  businessPhoneNumber: string;
  instagramId: string;
  businessName: string;
  businessNumber: string;
  ownerName: string;
  businessAddress: string;
  bankName: string;
  bankAccountNumber: string;
  accountHolder: string;
  bankbookImageUrl: string;
  isBankbookVerified: boolean;
  taxInvoiceEmail: string;
  hometaxApiKey: string;
}

interface UpdateBusinessProfileRequest {
  phoneNumber?: string;
  email?: string;
  businessPhoneNumber?: string;
  instagramId?: string;
  bankName?: string;
  bankAccountNumber?: string;
  accountHolder?: string;
  taxInvoiceEmail?: string;
  bankbookImage?: File;
  profileImage?: File;
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
  tagTypes: ['Profile', 'BusinessProfile'],
  endpoints: (builder) => ({
    getProfile: builder.query<UserProfile, void>({
      query: () => MY_PAGE_ENDPOINTS.PROFILE,
      transformResponse: (response: ApiResponse<UserProfile>) => response.data,
      providesTags: ['Profile'],
    }),

    getBusinessProfile: builder.query<BusinessProfile, void>({
      query: () => MY_PAGE_ENDPOINTS.BUSINESS_PROFILE,
      transformResponse: (response: ApiResponse<BusinessProfile>) =>
        response.data,
      providesTags: ['BusinessProfile'],
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

    updateBusinessProfile: builder.mutation<
      BusinessProfile,
      UpdateBusinessProfileRequest
    >({
      query: ({ bankbookImage, profileImage, ...body }) => {
        const formData = new FormData();
        formData.append(
          'request',
          new Blob([JSON.stringify(body)], { type: 'application/json' })
        );
        if (bankbookImage) {
          formData.append('bankbookImage', bankbookImage);
        }
        if (profileImage) {
          formData.append('profileImage', profileImage);
        }
        return {
          url: MY_PAGE_ENDPOINTS.BUSINESS_PROFILE,
          method: 'PATCH',
          body: formData,
        };
      },
      transformResponse: (response: ApiResponse<BusinessProfile>) =>
        response.data,
      invalidatesTags: ['BusinessProfile'],
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
  useGetBusinessProfileQuery,
  useUpdateProfileMutation,
  useUpdateBusinessProfileMutation,
  useSendPhoneVerificationMutation,
  useVerifyPhoneMutation,
} = myPageApi;
