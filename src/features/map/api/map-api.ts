import { createApi } from '@reduxjs/toolkit/query/react';

import { createBaseQuery } from '../../../shared/constants';
import type { ApiResponse } from '../../../shared/types';

import type { ShopDetail, ShopMapResponse } from '../types/map-types';
import type {
  FavoriteShopItem,
  FavoriteShopListResponse,
} from '../types/favorite-types';
import type { MapArtistListResponse } from '../types/map-artist-types';
import type { MapStoryListResponse } from '../types/map-story-types';
import type {
  AvailableSlotsResponse,
  ClassListResponse,
  CreateReservationRequest,
  CreateReservationResponse,
} from '../types/one-day-class-types';
import type {
  ShopReviewItem,
  ShopReviewListResponse,
} from '../types/review-types';

export const mapApi = createApi({
  reducerPath: 'mapApi',
  baseQuery: createBaseQuery(),
  tagTypes: [
    'Map',
    'Favorite',
    'MapArtist',
    'MapStory',
    'OneDayClass',
    'Review',
  ],
  endpoints: (builder) => ({
    // ── Map ──────────────────────────────────────────
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

    // ── Favorite ──────────────────────────────────────
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
      invalidatesTags: ['Favorite', 'Map'],
    }),
    removeShopFavorite: builder.mutation<void, number>({
      query: (shopId) => ({
        url: `/api/v1/favorites/shops/${shopId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Favorite', 'Map'],
    }),

    // ── Artist ───────────────────────────────────────
    getShopArtists: builder.query<MapArtistListResponse, number>({
      query: (shopId) => ({ url: `/api/v1/shops/${shopId}/artists` }),
      transformResponse: (response: { data: MapArtistListResponse }) =>
        response.data,
      providesTags: ['MapArtist'],
    }),

    // ── Story ────────────────────────────────────────
    getShopStories: builder.query<
      MapStoryListResponse,
      { shopId: number; page: number }
    >({
      query: ({ shopId, page }) => ({
        url: `/api/v1/shops/${shopId}/stories`,
        params: { page },
      }),
      transformResponse: (response: { data: MapStoryListResponse }) =>
        response.data,
      providesTags: ['MapStory'],
    }),

    // ── One Day Class ────────────────────────────────
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

    // ── Review ───────────────────────────────────────
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
  useGetShopMarkersQuery,
  useGetShopDetailQuery,
  useGetFavoriteShopListQuery,
  useLazyGetFavoriteShopListQuery,
  useAddShopFavoriteMutation,
  useRemoveShopFavoriteMutation,
  useGetShopArtistsQuery,
  useLazyGetShopStoriesQuery,
  useGetClassListQuery,
  useGetAvailableSlotsQuery,
  useCreateReservationMutation,
  useLazyGetShopReviewsQuery,
  useCreateShopReviewMutation,
  useUpdateShopReviewMutation,
  useDeleteShopReviewMutation,
} = mapApi;
