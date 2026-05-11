import { createApi } from '@reduxjs/toolkit/query/react';

import { createBaseQuery } from '../../../shared/constants';

import type { PostDetail, PostListResponse } from '../types/post-type';

export const postApi = createApi({
  reducerPath: 'postApi',
  baseQuery: createBaseQuery(),
  tagTypes: ['Post'],
  endpoints: (builder) => ({
    getAllPosts: builder.query<PostListResponse, number>({
      query: (page) => `/api/v1/posts/all?page=${page}`,
      providesTags: ['Post'],
    }),

    getUserPosts: builder.query<
      PostListResponse,
      { userId: number; page: number }
    >({
      query: ({ userId, page }) =>
        `/api/v1/posts?userId=${userId}&page=${page}`,
      providesTags: ['Post'],
    }),

    getPost: builder.query<PostDetail, number>({
      query: (postId) => `/posts/${postId}`,
    }),

    createPost: builder.mutation<PostDetail, FormData>({
      query: (formData) => ({
        url: '/api/v1/posts',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Post'],
    }),

    deletePost: builder.mutation<void, number>({
      query: (postId) => ({
        url: `/api/v1/posts/${postId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Post'],
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
      invalidatesTags: ['Post'],
    }),
  }),
});

export const {
  useLazyGetAllPostsQuery,
  useLazyGetUserPostsQuery,
  useLazyGetPostQuery,
  useCreatePostMutation,
  useDeletePostMutation,
  useUpdatePostMutation,
} = postApi;
