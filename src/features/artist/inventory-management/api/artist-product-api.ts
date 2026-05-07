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
  tagTypes: ['ArtistProduct'],
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
  }),
});

export const {
  useGetArtistProductsQuery,
  useCreateArtistProductMutation,
  useUpdateArtistProductMutation,
  useUpdateArtistProductStocksMutation,
  useDeleteArtistProductMutation,
} = artistProductApi;
