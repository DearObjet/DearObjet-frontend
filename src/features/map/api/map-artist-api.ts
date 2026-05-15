import { createApi } from '@reduxjs/toolkit/query/react';

import { createBaseQuery } from '../../../shared/constants';

import type { MapArtistListResponse } from '../types/map-artist-types';

export const mapArtistApi = createApi({
  reducerPath: 'mapArtistApi',
  baseQuery: createBaseQuery(),
  tagTypes: ['MapArtist'],
  endpoints: (builder) => ({
    getShopArtists: builder.query<MapArtistListResponse, number>({
      query: (shopId) => ({ url: `/api/v1/shops/${shopId}/artists` }),
      transformResponse: (response: { data: MapArtistListResponse }) =>
        response.data,
      providesTags: ['MapArtist'],
    }),
  }),
});

export const { useGetShopArtistsQuery } = mapArtistApi;
