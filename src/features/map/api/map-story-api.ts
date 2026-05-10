import { createApi } from '@reduxjs/toolkit/query/react';

import { createBaseQuery } from '../../../shared/constants';

import type { MapStoryListResponse } from '../types/map-story-types';

export const mapStoryApi = createApi({
  reducerPath: 'mapStoryApi',
  baseQuery: createBaseQuery(),
  tagTypes: ['MapStory'],
  endpoints: (builder) => ({
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
  }),
});

export const { useLazyGetShopStoriesQuery } = mapStoryApi;
