import { createApi } from '@reduxjs/toolkit/query/react';

import type { ApiResponse } from '../../../../shared/types';
import { createBaseQuery } from '../../../../shared/constants';

import type {
  AvailableProductListResponse,
  CreateShipmentParams,
  CreateShipmentResponse,
  GetAvailableProductsParams,
  ShipmentProductListResponse,
  ShopListResponse,
} from '../types/outbound-management-types';

export const outboundApi = createApi({
  reducerPath: 'outboundApi',
  baseQuery: createBaseQuery(),
  tagTypes: ['AvailableProducts', 'Shops', 'ShipmentProducts'],
  endpoints: (builder) => ({
    getShipmentShops: builder.query<ShopListResponse, void>({
      query: () => '/api/v1/artist/shipments/shops',
      transformResponse: (res: ApiResponse<ShopListResponse>) => res.data,
      providesTags: ['ShipmentProducts'],
    }),

    getShipmentProducts: builder.query<
      ShipmentProductListResponse,
      { shopId: number }
    >({
      query: ({ shopId }) =>
        `/api/v1/artist/shipments/shops/${shopId}/products`,
      transformResponse: (res: ApiResponse<ShipmentProductListResponse>) =>
        res.data,
      providesTags: ['ShipmentProducts'],
    }),

    getRecentShipmentProducts: builder.query<
      ShipmentProductListResponse,
      { shopId: number }
    >({
      query: ({ shopId }) =>
        `/api/v1/artist/shipments/shops/${shopId}/recent-products`,
      transformResponse: (res: ApiResponse<ShipmentProductListResponse>) =>
        res.data,
    }),

    getAvailableProducts: builder.query<
      AvailableProductListResponse,
      GetAvailableProductsParams
    >({
      query: ({ shopId, keyword = '', page = 1, size = 20 }) => ({
        url: `/api/v1/artist/shipments/shops/${shopId}/available-products`,
        params: { keyword, page, size },
      }),
      transformResponse: (res: ApiResponse<AvailableProductListResponse>) =>
        res.data,
      providesTags: ['AvailableProducts'],
    }),

    createShipment: builder.mutation<
      CreateShipmentResponse,
      CreateShipmentParams
    >({
      query: ({ shopId, request }) => ({
        url: `/api/v1/artist/shipments/shops/${shopId}/shipments`,
        method: 'POST',
        body: request,
      }),
      transformResponse: (res: ApiResponse<CreateShipmentResponse>) => res.data,
      invalidatesTags: ['AvailableProducts', 'Shops', 'ShipmentProducts'],
    }),
  }),
});

export const {
  useGetShipmentShopsQuery,
  useGetShipmentProductsQuery,
  useGetRecentShipmentProductsQuery,
  useGetAvailableProductsQuery,
  useCreateShipmentMutation,
} = outboundApi;
