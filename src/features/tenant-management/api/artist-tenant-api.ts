import { createApi } from '@reduxjs/toolkit/query/react';

import { createBaseQuery } from '../../../shared/constants';

import type {
  ArtistContractListResponse,
  ArtistContractDetail,
  ArtistSuggestionListResponse,
  ContractReleaseResponse,
} from '../types/artist-tenant-types';
import { ARTIST_TENANT_ENDPOINTS } from '../constants/artist-tenant-constants';

export const artistTenantApi = createApi({
  reducerPath: 'artistTenantApi',
  baseQuery: createBaseQuery(),
  tagTypes: ['ArtistTenant'],
  endpoints: (builder) => ({
    getArtistContracts: builder.query<ArtistContractListResponse, number>({
      query: (userId) =>
        `${ARTIST_TENANT_ENDPOINTS.ARTIST_CONTRACTS}?userId=${userId}`,
      transformResponse: (response: { data: ArtistContractListResponse }) =>
        response.data,
      providesTags: ['ArtistTenant'],
    }),

    getArtistContractDetail: builder.query<
      ArtistContractDetail,
      { contractId: number; userId: number }
    >({
      query: ({ contractId, userId }) =>
        `${ARTIST_TENANT_ENDPOINTS.ARTIST_CONTRACT_DETAIL(contractId)}?userId=${userId}`,
      transformResponse: (response: { data: ArtistContractDetail }) =>
        response.data,
      providesTags: ['ArtistTenant'],
    }),

    getArtistSuggestions: builder.query<ArtistSuggestionListResponse, number>({
      query: (userId) =>
        `${ARTIST_TENANT_ENDPOINTS.ARTIST_SUGGESTIONS}?userId=${userId}`,
      transformResponse: (response: { data: ArtistSuggestionListResponse }) =>
        response.data,
      providesTags: ['ArtistTenant'],
    }),

    releaseRequest: builder.mutation<
      ContractReleaseResponse,
      { contractId: number; userId: number }
    >({
      query: ({ contractId, userId }) => ({
        url: `${ARTIST_TENANT_ENDPOINTS.RELEASE_REQUEST(contractId)}?userId=${userId}`,
        method: 'PATCH',
      }),
      transformResponse: (response: { data: ContractReleaseResponse }) =>
        response.data,
      invalidatesTags: ['ArtistTenant'],
    }),

    releaseCancellation: builder.mutation<
      ContractReleaseResponse,
      { contractId: number; userId: number }
    >({
      query: ({ contractId, userId }) => ({
        url: `${ARTIST_TENANT_ENDPOINTS.RELEASE_CANCELLATION(contractId)}?userId=${userId}`,
        method: 'PATCH',
      }),
      transformResponse: (response: { data: ContractReleaseResponse }) =>
        response.data,
      invalidatesTags: ['ArtistTenant'],
    }),

    approveContract: builder.mutation<
      ContractReleaseResponse,
      { contractId: number; userId: number }
    >({
      query: ({ contractId, userId }) => ({
        url: `${ARTIST_TENANT_ENDPOINTS.APPROVAL(contractId)}?userId=${userId}`,
        method: 'PATCH',
      }),
      transformResponse: (response: { data: ContractReleaseResponse }) =>
        response.data,
      invalidatesTags: ['ArtistTenant'],
    }),
  }),
});

export const {
  useGetArtistContractsQuery,
  useGetArtistContractDetailQuery,
  useGetArtistSuggestionsQuery,
  useReleaseRequestMutation,
  useReleaseCancellationMutation,
  useApproveContractMutation,
} = artistTenantApi;
