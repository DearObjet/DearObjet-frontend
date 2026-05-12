import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import type {
  FestivalApiResponse,
  FestivalItem,
} from '../types/festival-types';
import {
  TOUR_API_BASE_URL,
  FESTIVAL_ITEMS_PER_PAGE,
} from '../constants/festival-constants';

interface FestivalParams {
  areacode?: string;
  pageNo: number;
}

interface FestivalListResponse {
  items: FestivalItem[];
  totalCount: number;
  pageNo: number;
}

export const festivalApi = createApi({
  reducerPath: 'festivalApi',
  baseQuery: fetchBaseQuery({ baseUrl: TOUR_API_BASE_URL }),
  endpoints: (builder) => ({
    getFestivals: builder.query<FestivalListResponse, FestivalParams>({
      query: ({ areacode, pageNo }) => {
        const decodedKey = decodeURIComponent(
          import.meta.env.VITE_TOUR_API_KEY
        );

        const params: Record<string, string> = {
          serviceKey: decodedKey,
          MobileOS: 'WEB',
          MobileApp: 'DearObjet',
          _type: 'json',
          eventStartDate: '20240101',
          numOfRows: String(FESTIVAL_ITEMS_PER_PAGE),
          pageNo: String(pageNo),
        };

        if (areacode && areacode !== '') {
          params.areaCode = areacode;
        }

        const queryString = Object.entries(params)
          .map(
            ([key, value]) =>
              `${key}=${key === 'serviceKey' ? value : encodeURIComponent(value)}`
          )
          .join('&');

        return `/searchFestival2?${queryString}`;
      },
      transformResponse: (response: FestivalApiResponse) => {
        const body = response?.response?.body;
        const items = body?.items;

        let extractedItems: FestivalItem[] = [];

        if (items && typeof items === 'object' && items.item) {
          extractedItems = Array.isArray(items.item)
            ? items.item
            : [items.item];
        }

        return {
          items: extractedItems,
          totalCount: body?.totalCount ?? 0,
          pageNo: body?.pageNo ?? 1,
        };
      },
    }),
  }),
});

export const { useGetFestivalsQuery } = festivalApi;
