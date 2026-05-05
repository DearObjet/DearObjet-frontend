import { createApi } from '@reduxjs/toolkit/query/react';

import { createBaseQuery } from '../../../../shared/constants';

import type {
  ContractProductsResult,
  InboundArtist,
  InboundRecord,
  RawContractProduct,
  RawContractProductsData,
  RawInventoryItem,
  StockMovementRequest,
} from '../types/inbound';
import { SPECIALTY_LABEL } from '../constants/inbound-constants';

const formatDate = (iso: string | null): string => {
  if (!iso) return '-';
  return iso.slice(0, 10).replace(/-/g, '.');
};

const formatCommission = (
  type: 'RATE' | 'FIXED_AMOUNT',
  value: number
): string => (type === 'RATE' ? `${value}%` : `${value.toLocaleString()}원`);

const toInboundArtist = (item: RawInventoryItem): InboundArtist => ({
  id: item.contractId,
  imageUrl: item.artistImageUrl ?? '',
  name: item.artistName,
  category: SPECIALTY_LABEL[item.specialty] ?? item.specialty,
  lastInboundDate: formatDate(item.recentStockedAt),
  inboundConfirm: item.inboundConfirmed ? '승인' : '미확인',
  memo: '',
});

const toInboundRecord = (
  item: RawContractProduct,
  fallbackArtistName: string
): InboundRecord => ({
  id: item.contractProductId,
  imageUrl: item.productImageUrl ?? '',
  productName: item.productName,
  price: item.sellingPrice,
  stock: item.stockQuantity,
  commission: formatCommission(item.commissionType, item.commissionValue),
  commissionRate: item.commissionValue,
  marginAmount: item.marginAmount,
  settlementPerUnit: item.unitSettlementAmount,
  artistName: item.artistName ?? fallbackArtistName,
  lastInboundDate: formatDate(item.recentStockedAt),
});

export const inboundApi = createApi({
  reducerPath: 'inboundApi',
  baseQuery: createBaseQuery(),
  tagTypes: ['InboundArtists', 'ContractProducts'],
  endpoints: (builder) => ({
    getInventoryArtists: builder.query<InboundArtist[], void>({
      query: () => '/api/v1/contracts/inventory',
      transformResponse: (res: { data: { items: RawInventoryItem[] } }) =>
        res.data.items.map(toInboundArtist),
      providesTags: ['InboundArtists'],
    }),

    getContractProducts: builder.query<ContractProductsResult, number>({
      query: (contractId) =>
        `/api/v1/contracts/inventory/${contractId}/products`,
      transformResponse: (res: { data: RawContractProductsData }) => ({
        memo: res.data.memo ?? '',
        records: res.data.items.map((item) =>
          toInboundRecord(item, res.data.artistName)
        ),
      }),
      providesTags: (_result, _error, contractId) => [
        { type: 'ContractProducts', id: contractId },
      ],
    }),

    updateMemo: builder.mutation<void, { contractId: number; memo: string }>({
      query: ({ contractId, memo }) => ({
        url: `/api/v1/contracts/inventory/${contractId}/memo`,
        method: 'PATCH',
        body: { memo },
      }),
      invalidatesTags: (_result, _error, { contractId }) => [
        { type: 'ContractProducts', id: contractId },
      ],
    }),

    toggleInboundConfirmation: builder.mutation<void, number>({
      query: (contractId) => ({
        url: `/api/v1/contracts/inventory/${contractId}/inbound-confirmation`,
        method: 'PATCH',
      }),
      invalidatesTags: ['InboundArtists'],
    }),

    addStockMovement: builder.mutation<void, StockMovementRequest>({
      query: ({ contractProductId, ...body }) => ({
        url: `/api/v1/contracts/inventory/${contractProductId}/stock-movements`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (_result, _error, { contractId }) => [
        'InboundArtists',
        { type: 'ContractProducts', id: contractId },
      ],
    }),
  }),
});

export const {
  useGetInventoryArtistsQuery,
  useGetContractProductsQuery,
  useUpdateMemoMutation,
  useToggleInboundConfirmationMutation,
  useAddStockMovementMutation,
} = inboundApi;
