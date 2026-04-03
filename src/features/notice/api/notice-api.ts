import { createApi } from '@reduxjs/toolkit/query/react';

import type { NoticeApiItem } from '../types/notice-types';

import { createBaseQuery } from '../../../shared/constants';
import {
  ITEMS_PER_PAGE,
  NOTICE_ENDPOINTS,
} from '../constants/notice-constants';

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
  baseQuery: createBaseQuery(),
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
        return `${NOTICE_ENDPOINTS.NOTICES}?${params.toString()}`;
      },
      transformResponse: (response: { data: NoticeListResponse }) =>
        response.data,
      providesTags: ['Notice'],
    }),

    getNoticeDetail: builder.query<NoticeApiItem, number>({
      query: (noticeId) => NOTICE_ENDPOINTS.NOTICE_DETAIL(noticeId),
      transformResponse: (response: { data: NoticeApiItem }) => response.data,
      providesTags: ['Notice'],
    }),
  }),
});

export const { useGetNoticesQuery, useGetNoticeDetailQuery } = noticeApi;
