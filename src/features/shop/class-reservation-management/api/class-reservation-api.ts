import { createApi } from '@reduxjs/toolkit/query/react';

import { createBaseQuery } from '../../../../shared/constants';
import type { ApiResponse } from '../../../../shared/types';
import type { ReservationListResponse } from '../types/reservation-types';

const CLASS_RESERVATION_ENDPOINTS = {
  LIST: '/api/v1/class-reservations',
  CONFIRM: (reservationId: number) =>
    `/api/v1/class-reservations/${reservationId}/confirm`,
  CANCEL: (reservationId: number) =>
    `/api/v1/class-reservations/${reservationId}/cancel`,
};

export const classReservationApi = createApi({
  reducerPath: 'classReservationApi',
  baseQuery: createBaseQuery(),
  tagTypes: ['ClassReservation'] as const,
  endpoints: (builder) => ({
    getClassReservations: builder.query<ReservationListResponse, void>({
      query: () => ({
        url: CLASS_RESERVATION_ENDPOINTS.LIST,
        params: { page: 1, size: 100 },
      }),
      transformResponse: (response: ApiResponse<ReservationListResponse>) =>
        response.data,
      providesTags: ['ClassReservation'],
    }),
    confirmReservation: builder.mutation<void, number>({
      query: (reservationId) => ({
        url: CLASS_RESERVATION_ENDPOINTS.CONFIRM(reservationId),
        method: 'POST',
      }),
      invalidatesTags: ['ClassReservation'],
    }),
    cancelReservation: builder.mutation<void, number>({
      query: (reservationId) => ({
        url: CLASS_RESERVATION_ENDPOINTS.CANCEL(reservationId),
        method: 'POST',
      }),
      invalidatesTags: ['ClassReservation'],
    }),
  }),
});

export const {
  useGetClassReservationsQuery,
  useConfirmReservationMutation,
  useCancelReservationMutation,
} = classReservationApi;
