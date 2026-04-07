import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import type { RootState } from '../../app/store';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const createBaseQuery = () =>
  fetchBaseQuery({
    baseUrl: API_BASE_URL,
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.accessToken;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  });
