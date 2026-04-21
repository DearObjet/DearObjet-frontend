import { createApi } from '@reduxjs/toolkit/query/react';

import { createBaseQuery } from '../../../../shared/constants';
import { STORY_ENDPOINTS } from '../constants/story-constants';
import type {
  ShopBusinessHoursResponse,
  UpdateBusinessHoursRequest,
} from '../types/business-hour';

export const storyApi = createApi({
  reducerPath: 'storyApi',
  baseQuery: createBaseQuery(),
  tagTypes: ['Story'],
  endpoints: (builder) => ({
    getBusinessHours: builder.query<ShopBusinessHoursResponse, void>({
      query: () => ({
        url: STORY_ENDPOINTS.BUSINESS_HOURS,
        method: 'GET',
      }),
      transformResponse: (response: { data: ShopBusinessHoursResponse }) =>
        response.data,
      providesTags: ['Story'],
    }),
    updateBusinessHours: builder.mutation<
      ShopBusinessHoursResponse,
      UpdateBusinessHoursRequest
    >({
      query: (body) => ({
        url: STORY_ENDPOINTS.BUSINESS_HOURS,
        method: 'PATCH',
        body,
      }),
      transformResponse: (response: { data: ShopBusinessHoursResponse }) =>
        response.data,
      invalidatesTags: ['Story'],
    }),
  }),
});

export const { useGetBusinessHoursQuery, useUpdateBusinessHoursMutation } =
  storyApi;
