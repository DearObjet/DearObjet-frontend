import { createApi } from '@reduxjs/toolkit/query/react';

import { createBaseQuery } from '../../../shared/constants';
import type { ApiResponse } from '../../../shared/types';

import type {
  FavoriteShopItem,
  FavoriteShopListResponse,
} from '../types/favorite-types';

export const favoriteApi = createApi({
  reducerPath: 'favoriteApi',
  baseQuery: createBaseQuery(),
  tagTypes: ['Favorite'],
  endpoints: (builder) => ({
    getFavoriteShopList: builder.query<FavoriteShopListResponse, number>({
      query: (page) => `/api/v1/favorites/shops?page=${page}&size=12`,
      transformResponse: (res: ApiResponse<FavoriteShopListResponse>) =>
        res.data,
      providesTags: ['Favorite'],
    }),
    addShopFavorite: builder.mutation<FavoriteShopItem, number>({
      query: (shopId) => ({
        url: `/api/v1/favorites/shops/${shopId}`,
        method: 'POST',
      }),
      transformResponse: (res: ApiResponse<FavoriteShopItem>) => res.data,
      invalidatesTags: ['Favorite'],
    }),
    removeShopFavorite: builder.mutation<void, number>({
      query: (shopId) => ({
        url: `/api/v1/favorites/shops/${shopId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Favorite'],
    }),
  }),
});

export const {
  useGetFavoriteShopListQuery,
  useLazyGetFavoriteShopListQuery,
  useAddShopFavoriteMutation,
  useRemoveShopFavoriteMutation,
} = favoriteApi;
