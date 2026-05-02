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

interface GetReservationsParams {
  year: number;
  month: number;
}

export const classReservationApi = createApi({
  reducerPath: 'classReservationApi',
  baseQuery: createBaseQuery(),
  tagTypes: ['ClassReservation'] as const,
  endpoints: (builder) => ({
    getClassReservations: builder.query<
      ReservationListResponse,
      GetReservationsParams
    >({
      query: ({ year, month }) => ({
        url: CLASS_RESERVATION_ENDPOINTS.LIST,
        params: { year, month },
      }),
      transformResponse: (response: ApiResponse<ReservationListResponse>) =>
        response.data,
      providesTags: ['ClassReservation'],
    }),
    confirmReservation: builder.mutation<void, number>({
      query: (reservationId) => ({
        url: CLASS_RESERVATION_ENDPOINTS.CONFIRM(reservationId),
        method: 'PATCH',
      }),
      invalidatesTags: ['ClassReservation'],
    }),
    cancelReservation: builder.mutation<void, number>({
      query: (reservationId) => ({
        url: CLASS_RESERVATION_ENDPOINTS.CANCEL(reservationId),
        method: 'PATCH',
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
