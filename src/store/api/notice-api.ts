import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { NoticeApiItem } from '../../components/notice/notice-list';
import type { RootState } from '../index';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const ITEMS_PER_PAGE = 10;

interface NoticeListParams {
  target: 'USER' | 'ARTIST_SHOP';
  category?: string | null;
  page: number;
}

interface NoticeListResponse {
  items: NoticeApiItem[];
  page: number;
  totalPages: number;
}

export const noticeApi = createApi({
  reducerPath: 'noticeApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.accessToken;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Notice'],
  endpoints: (builder) => ({
    getNotices: builder.query<NoticeListResponse, NoticeListParams>({
      query: ({ target, category, page }) => {
        const params = new URLSearchParams({
          target,
          page: String(page),
          size: String(ITEMS_PER_PAGE),
        });
        if (category) params.set('category', category);
        return `/api/v1/notices?${params.toString()}`;
      },
      transformResponse: (response: { data: NoticeListResponse }) =>
        response.data,
      providesTags: ['Notice'],
    }),

    getNoticeDetail: builder.query<NoticeApiItem, number>({
      query: (noticeId) => `/api/v1/notices/${noticeId}`,
      transformResponse: (response: { data: NoticeApiItem }) => response.data,
      providesTags: ['Notice'],
    }),
  }),
});

export const { useGetNoticesQuery, useGetNoticeDetailQuery } = noticeApi;
