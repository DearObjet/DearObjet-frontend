import { createApi } from '@reduxjs/toolkit/query/react';

import { createBaseQuery } from '../../../shared/constants';
import type { ApiResponse } from '../../../shared/types';

import type { PostDetail, PostListResponse } from '../types/post-type';

export const postApi = createApi({
  reducerPath: 'postApi',
  baseQuery: createBaseQuery(),
  tagTypes: ['Post'],
  endpoints: (builder) => ({
    getAllPosts: builder.query<PostListResponse, number>({
      query: (page) => `/api/v1/posts/all?page=${page}`,
      transformResponse: (res: ApiResponse<PostListResponse>) => res.data,
      providesTags: ['Post'],
    }),

    getUserPosts: builder.query<
      PostListResponse,
      { userId: number; page: number }
    >({
      query: ({ userId, page }) =>
        `/api/v1/posts?userId=${userId}&page=${page}`,
      transformResponse: (res: ApiResponse<PostListResponse>) => res.data,
      providesTags: ['Post'],
    }),

    getPost: builder.query<PostDetail, number>({
      query: (postId) => `/api/v1/posts/${postId}`,
      transformResponse: (res: ApiResponse<PostDetail>) => res.data,
    }),

    createPost: builder.mutation<PostDetail, FormData>({
      query: (formData) => ({
        url: '/api/v1/posts',
        method: 'POST',
        body: formData,
      }),
      transformResponse: (res: ApiResponse<PostDetail>) => res.data,
      invalidatesTags: ['Post'],
    }),

    deletePost: builder.mutation<void, number>({
      query: (postId) => ({
        url: `/api/v1/posts/${postId}`,
        method: 'DELETE',
      }),
    }),

    updatePost: builder.mutation<
      PostDetail,
      { postId: number; formData: FormData }
    >({
      query: ({ postId, formData }) => ({
        url: `/api/v1/posts/${postId}`,
        method: 'PUT',
        body: formData,
      }),
      transformResponse: (res: ApiResponse<PostDetail>) => res.data,
      invalidatesTags: ['Post'],
    }),
  }),
});

export const {
  useGetAllPostsQuery,
  useLazyGetAllPostsQuery,
  useGetUserPostsQuery,
  useLazyGetUserPostsQuery,
  useLazyGetPostQuery,
  useCreatePostMutation,
  useDeletePostMutation,
  useUpdatePostMutation,
} = postApi;
