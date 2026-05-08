import { createApi } from '@reduxjs/toolkit/query/react';

import { createBaseQuery } from '../../../../shared/constants';

import type {
  ArtistProduct,
  ArtistProductListData,
  ProductFormData,
  UpdateStocksResponse,
  GetProductsParams,
  UpdateProductParams,
  UpdateStockItem,
} from '../types/inventory';

const buildProductFormData = (data: ProductFormData): FormData => {
  const formData = new FormData();
  formData.append(
    'request',
    new Blob(
      [
        JSON.stringify({
          productName: data.productName,
          price: data.price,
          stockQuantity: data.stockQuantity,
        }),
      ],
      { type: 'application/json' }
    )
  );
  if (data.imageFile) {
    formData.append('productImage', data.imageFile);
  }
  return formData;
};

export const artistProductApi = createApi({
  reducerPath: 'artistProductApi',
  baseQuery: createBaseQuery(),
  tagTypes: ['ArtistProduct', 'ArtistProductMemo'],
  endpoints: (builder) => ({
    getArtistProducts: builder.query<ArtistProductListData, GetProductsParams>({
      query: ({ page = 1, size = 20 } = {}) => ({
        url: '/api/v1/artist/products',
        params: { page, size },
      }),
      transformResponse: (res: { data: ArtistProductListData }) => res.data,
      providesTags: ['ArtistProduct'],
    }),

    createArtistProduct: builder.mutation<ArtistProduct, ProductFormData>({
      query: (data) => ({
        url: '/api/v1/artist/products',
        method: 'POST',
        body: buildProductFormData(data),
      }),
      transformResponse: (res: { data: ArtistProduct }) => res.data,
      invalidatesTags: ['ArtistProduct'],
    }),

    updateArtistProduct: builder.mutation<ArtistProduct, UpdateProductParams>({
      query: ({ productId, data }) => ({
        url: `/api/v1/artist/products/${productId}`,
        method: 'PUT',
        body: buildProductFormData(data),
      }),
      transformResponse: (res: { data: ArtistProduct }) => res.data,
      invalidatesTags: ['ArtistProduct'],
    }),

    updateArtistProductStocks: builder.mutation<
      UpdateStocksResponse,
      UpdateStockItem[]
    >({
      query: (items) => ({
        url: '/api/v1/artist/products/stocks',
        method: 'PATCH',
        body: { items },
      }),
      transformResponse: (res: { data: UpdateStocksResponse }) => res.data,
      invalidatesTags: ['ArtistProduct'],
    }),

    deleteArtistProduct: builder.mutation<void, number>({
      query: (productId) => ({
        url: `/api/v1/artist/products/${productId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['ArtistProduct'],
    }),

    getProductMemo: builder.query<{ productId: number; memo: string }, number>({
      query: (productId) => ({
        url: `/api/v1/artist/products/${productId}/memo`,
      }),
      transformResponse: (res: { data: { productId: number; memo: string } }) =>
        res.data,
      providesTags: (_result, _error, productId) => [
        { type: 'ArtistProductMemo', id: productId },
      ],
    }),

    updateProductMemo: builder.mutation<
      { productId: number; memo: string },
      { productId: number; memo: string }
    >({
      query: ({ productId, memo }) => ({
        url: `/api/v1/artist/products/${productId}/memo`,
        method: 'PATCH',
        body: { memo },
      }),
      transformResponse: (res: { data: { productId: number; memo: string } }) =>
        res.data,
      invalidatesTags: (_result, _error, { productId }) => [
        { type: 'ArtistProductMemo', id: productId },
      ],
    }),

    deleteProductMemo: builder.mutation<
      { productId: number; memo: string },
      number
    >({
      query: (productId) => ({
        url: `/api/v1/artist/products/${productId}/memo`,
        method: 'DELETE',
      }),
      transformResponse: (res: { data: { productId: number; memo: string } }) =>
        res.data,
      invalidatesTags: (_result, _error, productId) => [
        { type: 'ArtistProductMemo', id: productId },
      ],
    }),
  }),
});

export const {
  useGetArtistProductsQuery,
  useCreateArtistProductMutation,
  useUpdateArtistProductMutation,
  useUpdateArtistProductStocksMutation,
  useDeleteArtistProductMutation,
  useGetProductMemoQuery,
  useUpdateProductMemoMutation,
  useDeleteProductMemoMutation,
} = artistProductApi;
