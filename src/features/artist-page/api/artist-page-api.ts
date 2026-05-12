import { createApi } from '@reduxjs/toolkit/query/react';

import { createBaseQuery } from '../../../shared/constants';
import {
  ARTIST_PAGE_ENDPOINTS,
  ARTIST_PAGE_SIZE,
} from '../constants/artist-page-constants';
import type {
  ArtistListParams,
  ArtistListResponse,
} from '../types/artist-page-types';

export const artistPageApi = createApi({
  reducerPath: 'artistPageApi',
  baseQuery: createBaseQuery(),
  tagTypes: ['ArtistPage'],
  endpoints: (builder) => ({
    getArtists: builder.query<ArtistListResponse['data'], ArtistListParams>({
      query: ({ seed, cursor, size = ARTIST_PAGE_SIZE }) => {
        const params = new URLSearchParams({
          size: String(size),
        });
        if (seed !== undefined) params.set('seed', String(seed));
        if (cursor !== undefined) params.set('cursor', String(cursor));
        return `${ARTIST_PAGE_ENDPOINTS.ARTISTS}?${params.toString()}`;
      },
      transformResponse: (response: ArtistListResponse) => response.data,
      providesTags: ['ArtistPage'],
    }),
  }),
});

export const { useGetArtistsQuery } = artistPageApi;
