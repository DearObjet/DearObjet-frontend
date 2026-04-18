import { createApi } from '@reduxjs/toolkit/query/react';

import { createBaseQuery } from '../../../shared/constants';
import type { ShopDetail, ShopMapResponse } from '../types/map-types';

export const mapApi = createApi({
  reducerPath: 'mapApi',
  baseQuery: createBaseQuery(),
  tagTypes: ['Map'],
  endpoints: (builder) => ({
    getShopMarkers: builder.query<ShopMapResponse, void>({
      query: () => '/api/v1/shops/map',
      transformResponse: (response: { data: ShopMapResponse }) => response.data,
      providesTags: ['Map'],
    }),

    getShopDetail: builder.query<ShopDetail, number>({
      query: (shopId) => `/api/v1/shops/${shopId}`,
      transformResponse: (response: { data: ShopDetail }) => response.data,
      providesTags: ['Map'],
    }),
  }),
});

export const { useGetShopMarkersQuery, useGetShopDetailQuery } = mapApi;
