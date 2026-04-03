import { createApi } from '@reduxjs/toolkit/query/react';

import type {
  CompleteBusinessSignupRequest,
  CompleteSignupRequest,
  SendPhoneVerificationRequest,
  SendPhoneVerificationResponse,
  VerifyPhoneRequest,
  VerifyPhoneResponse,
} from '../types/signup-types';
import type { ApiResponse } from '../../../shared/types/api-types';
import { createBaseQuery } from '../../../shared/constants';
import { SIGNUP_ENDPOINTS } from '../constants/signup-constants';

export const signupApi = createApi({
  reducerPath: 'signupApi',
  baseQuery: createBaseQuery(),
  tagTypes: ['Signup'],
  endpoints: (builder) => ({
    // 일반회원 가입
    completeSignup: builder.mutation<void, CompleteSignupRequest>({
      query: (data) => ({
        url: SIGNUP_ENDPOINTS.COMPLETE_SIGNUP,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Signup'],
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
          url: SIGNUP_ENDPOINTS.COMPLETE_SHOP_SIGNUP,
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: ['Signup'],
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
          url: SIGNUP_ENDPOINTS.COMPLETE_ARTIST_SIGNUP,
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: ['Signup'],
    }),

    // 휴대폰 인증번호 발송
    sendPhoneVerification: builder.mutation<
      SendPhoneVerificationResponse,
      SendPhoneVerificationRequest
    >({
      query: (data) => ({
        url: SIGNUP_ENDPOINTS.COMPLETE_PHONE_VERIFICATION,
        method: 'POST',
        body: data,
      }),
      transformResponse: (
        response: ApiResponse<SendPhoneVerificationResponse>
      ) => response.data,
    }),

    // 휴대폰 인증번호 확인
    verifyPhone: builder.mutation<VerifyPhoneResponse, VerifyPhoneRequest>({
      query: (data) => ({
        url: SIGNUP_ENDPOINTS.COMPLETE_VERIFY_PHONE,
        method: 'POST',
        body: data,
      }),
      transformResponse: (response: ApiResponse<VerifyPhoneResponse>) =>
        response.data,
    }),
  }),
});

export const {
  useCompleteSignupMutation,
  useCompleteShopSignupMutation,
  useCompleteArtistSignupMutation,
  useSendPhoneVerificationMutation,
  useVerifyPhoneMutation,
} = signupApi;
