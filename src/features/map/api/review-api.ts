import { createApi } from '@reduxjs/toolkit/query/react';

import { createBaseQuery } from '../../../shared/constants';
import type { ApiResponse } from '../../../shared/types';
import type {
  ShopReviewItem,
  ShopReviewListResponse,
} from '../types/review-types';

export const reviewApi = createApi({
  reducerPath: 'reviewApi',
  baseQuery: createBaseQuery(),
  tagTypes: ['Review'],
  endpoints: (builder) => ({
    getShopReviews: builder.query<
      ShopReviewListResponse,
      { shopId: number; cursorId?: number | null; size?: number }
    >({
      query: ({ shopId, cursorId, size = 10 }) => ({
        url: `/api/v1/shops/${shopId}/reviews`,
        params: {
          ...(cursorId != null && { cursorId }),
          size,
        },
      }),
      transformResponse: (res: ApiResponse<ShopReviewListResponse>) => res.data,
      providesTags: ['Review'],
    }),

    createShopReview: builder.mutation<
      ShopReviewItem,
      { shopId: number; formData: FormData }
    >({
      query: ({ shopId, formData }) => ({
        url: `/api/v1/shops/${shopId}/reviews`,
        method: 'POST',
        body: formData,
      }),
      transformResponse: (res: ApiResponse<ShopReviewItem>) => res.data,
    }),

    updateShopReview: builder.mutation<
      ShopReviewItem,
      { shopId: number; reviewId: number; formData: FormData }
    >({
      query: ({ shopId, reviewId, formData }) => ({
        url: `/api/v1/shops/${shopId}/reviews/${reviewId}`,
        method: 'PUT',
        body: formData,
      }),
      transformResponse: (res: ApiResponse<ShopReviewItem>) => res.data,
    }),

    deleteShopReview: builder.mutation<
      void,
      { shopId: number; reviewId: number }
    >({
      query: ({ shopId, reviewId }) => ({
        url: `/api/v1/shops/${shopId}/reviews/${reviewId}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useLazyGetShopReviewsQuery,
  useCreateShopReviewMutation,
  useUpdateShopReviewMutation,
  useDeleteShopReviewMutation,
} = reviewApi;
