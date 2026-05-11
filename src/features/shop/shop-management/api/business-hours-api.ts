import { createApi } from '@reduxjs/toolkit/query/react';

import { createBaseQuery } from '../../../../shared/constants';
import { BUSINESS_HOURS_ENDPOINTS } from '../constants/business-hours-constants';
import type {
  ShopBusinessHoursResponse,
  UpdateBusinessHoursRequest,
} from '../types/business-hours-types';

export const businessHoursApi = createApi({
  reducerPath: 'businessHoursApi',
  baseQuery: createBaseQuery(),
  tagTypes: ['BusinessHours'],
  endpoints: (builder) => ({
    getBusinessHours: builder.query<ShopBusinessHoursResponse, void>({
      query: () => ({
        url: BUSINESS_HOURS_ENDPOINTS.BUSINESS_HOURS,
        method: 'GET',
      }),
      transformResponse: (response: { data: ShopBusinessHoursResponse }) =>
        response.data,
      providesTags: ['BusinessHours'],
    }),
    updateBusinessHours: builder.mutation<
      ShopBusinessHoursResponse,
      UpdateBusinessHoursRequest
    >({
      query: (body) => ({
        url: BUSINESS_HOURS_ENDPOINTS.BUSINESS_HOURS,
        method: 'PATCH',
        body,
      }),
      transformResponse: (response: { data: ShopBusinessHoursResponse }) =>
        response.data,
      invalidatesTags: ['BusinessHours'],
    }),
  }),
});

export const { useGetBusinessHoursQuery, useUpdateBusinessHoursMutation } =
  businessHoursApi;
