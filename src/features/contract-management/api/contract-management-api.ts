import { createApi } from '@reduxjs/toolkit/query/react';

import { createBaseQuery } from '../../../shared/constants';
import type { ApiResponse } from '../../../shared/types';

import { CONTRACT_MANAGEMENT_ENDPOINTS } from '../constants/contract-management-constants';
import type {
  ArtistSearchResponse,
  SendContractRequest,
  SendContractResponse,
  ArtistSubmissionRequest,
  InProgressContractResponse,
  CompletedContractResponse,
  ContractDetailData,
} from '../types/contract-management-types';

export const contractManagementApi = createApi({
  reducerPath: 'contractManagementApi',
  baseQuery: createBaseQuery(),
  tagTypes: ['InProgress', 'Completed'],
  endpoints: (builder) => ({
    searchArtists: builder.query<
      ArtistSearchResponse,
      { userId: number; keyword: string }
    >({
      query: ({ userId, keyword }) =>
        `${CONTRACT_MANAGEMENT_ENDPOINTS.SEARCH_ARTISTS}?userId=${userId}&keyword=${keyword}`,
      transformResponse: (response: ApiResponse<ArtistSearchResponse>) =>
        response.data,
    }),

    sendContract: builder.mutation<
      SendContractResponse,
      { artistId: number; userId: number; body: SendContractRequest }
    >({
      query: ({ artistId, userId, body }) => ({
        url: `${CONTRACT_MANAGEMENT_ENDPOINTS.SEND_CONTRACT(artistId)}?userId=${userId}`,
        method: 'POST',
        body,
      }),
      transformResponse: (response: ApiResponse<SendContractResponse>) =>
        response.data,
      invalidatesTags: ['InProgress'],
    }),

    artistSubmission: builder.mutation<
      SendContractResponse,
      { contractId: number; userId: number; body: ArtistSubmissionRequest }
    >({
      query: ({ contractId, userId, body }) => ({
        url: `${CONTRACT_MANAGEMENT_ENDPOINTS.ARTIST_SUBMISSION(contractId)}?userId=${userId}`,
        method: 'PATCH',
        body,
      }),
      transformResponse: (response: ApiResponse<SendContractResponse>) =>
        response.data,
      invalidatesTags: ['InProgress'],
    }),

    getInProgressContracts: builder.query<InProgressContractResponse, number>({
      query: (userId) =>
        `${CONTRACT_MANAGEMENT_ENDPOINTS.IN_PROGRESS}?userId=${userId}`,
      transformResponse: (response: ApiResponse<InProgressContractResponse>) =>
        response.data,
      providesTags: ['InProgress'],
    }),

    getCompletedContracts: builder.query<CompletedContractResponse, number>({
      query: (userId) =>
        `${CONTRACT_MANAGEMENT_ENDPOINTS.COMPLETED}?userId=${userId}`,
      transformResponse: (response: ApiResponse<CompletedContractResponse>) =>
        response.data,
      providesTags: ['Completed'],
    }),

    getContractDetail: builder.query<
      ContractDetailData,
      { contractId: number; userId: number; isShop: boolean }
    >({
      query: ({ contractId, userId, isShop }) => {
        const url = isShop
          ? CONTRACT_MANAGEMENT_ENDPOINTS.CONTRACT_DETAIL_AS_SHOP(contractId)
          : CONTRACT_MANAGEMENT_ENDPOINTS.CONTRACT_DETAIL_AS_ARTIST(contractId);
        return `${url}?userId=${userId}`;
      },
      transformResponse: (response: ApiResponse<ContractDetailData>) =>
        response.data,
    }),
  }),
});

export const {
  useSearchArtistsQuery,
  useSendContractMutation,
  useArtistSubmissionMutation,
  useGetInProgressContractsQuery,
  useGetCompletedContractsQuery,
  useGetContractDetailQuery,
} = contractManagementApi;
