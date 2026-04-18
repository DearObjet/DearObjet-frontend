import { createApi } from '@reduxjs/toolkit/query/react';

import { createBaseQuery } from '../../../shared/constants';

import type {
  AvailableSlotsResponse,
  ClassListResponse,
  CreateReservationRequest,
  CreateReservationResponse,
} from '../types/one-day-class-types';

export const oneDayClassApi = createApi({
  reducerPath: 'oneDayClassApi',
  baseQuery: createBaseQuery(),
  tagTypes: ['OneDayClass'],
  endpoints: (builder) => ({
    getClassList: builder.query<ClassListResponse, number>({
      query: (shopId) => `/api/v1/shops/${shopId}/classes`,
      transformResponse: (response: { data: ClassListResponse }) =>
        response.data,
      providesTags: ['OneDayClass'],
    }),
    getAvailableSlots: builder.query<
      AvailableSlotsResponse,
      { classId: number; date: string }
    >({
      query: ({ classId, date }) =>
        `/api/v1/classes/${classId}/available-slots?date=${date}`,
      transformResponse: (response: { data: AvailableSlotsResponse }) =>
        response.data,
      providesTags: ['OneDayClass'],
    }),

    createReservation: builder.mutation<
      CreateReservationResponse,
      CreateReservationRequest
    >({
      query: (body) => ({
        url: '/api/v1/class-reservations',
        method: 'POST',
        body,
      }),
      transformResponse: (response: { data: CreateReservationResponse }) =>
        response.data,
      invalidatesTags: ['OneDayClass'],
    }),
  }),
});

export const {
  useGetClassListQuery,
  useGetAvailableSlotsQuery,
  useCreateReservationMutation,
} = oneDayClassApi;
