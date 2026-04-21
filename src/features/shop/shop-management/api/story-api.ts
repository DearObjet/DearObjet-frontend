import { createApi } from '@reduxjs/toolkit/query/react';

import { createBaseQuery } from '../../../../shared/constants';
import { STORY_ENDPOINTS } from '../constants/story-constants';

type DayKey =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';
type DayBusinessHours = { openTime: string | null; closeTime: string | null };
export type UpdateBusinessHoursRequest = Record<DayKey, DayBusinessHours>;
type ShopBusinessHoursResponse = Record<DayKey, DayBusinessHours>;

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
