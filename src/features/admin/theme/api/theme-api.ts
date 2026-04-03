import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';

import type { SystemTheme } from '../types/theme-types';
import { DEFAULT_SYSTEM_THEME } from '../constants/default-theme';

interface UserThemePreference {
  mode: 'light' | 'dark';
}

const defaultUserTheme: UserThemePreference = {
  mode: 'light',
};

export const themeApi = createApi({
  reducerPath: 'themeApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['SystemTheme', 'UserTheme'],
  endpoints: (builder) => ({
    getSystemTheme: builder.query<SystemTheme, void>({
      queryFn: async () => {
        try {
          const stored = localStorage.getItem('system-theme');
          const data = stored ? JSON.parse(stored) : DEFAULT_SYSTEM_THEME;
          return { data };
        } catch (error) {
          console.error('Error loading theme:', error);
          return { data: DEFAULT_SYSTEM_THEME };
        }
      },
      providesTags: ['SystemTheme'],
    }),

    updateSystemTheme: builder.mutation<SystemTheme, Partial<SystemTheme>>({
      queryFn: async (updates) => {
        try {
          const stored = localStorage.getItem('system-theme');
          const current = stored ? JSON.parse(stored) : DEFAULT_SYSTEM_THEME;
          const updated = { ...current, ...updates };
          localStorage.setItem('system-theme', JSON.stringify(updated));
          return { data: updated };
        } catch (error) {
          console.error('Error updating theme:', error);
          return { error: { status: 500, data: 'Failed to update theme' } };
        }
      },
      invalidatesTags: ['SystemTheme'],
    }),

    // 기본 테마로 초기화
    resetSystemTheme: builder.mutation<SystemTheme, void>({
      queryFn: async () => {
        try {
          localStorage.removeItem('system-theme');
          return { data: DEFAULT_SYSTEM_THEME };
        } catch (error) {
          console.error('Error resetting theme:', error);
          return { error: { status: 500, data: 'Failed to reset theme' } };
        }
      },
      invalidatesTags: ['SystemTheme'],
    }),

    getUserTheme: builder.query<UserThemePreference, void>({
      queryFn: async () => {
        try {
          const stored = localStorage.getItem('user-theme');
          const data = stored ? JSON.parse(stored) : defaultUserTheme;
          return { data };
        } catch (error) {
          console.error('Error loading user theme:', error);
          return { data: defaultUserTheme };
        }
      },
      providesTags: ['UserTheme'],
    }),

    updateUserTheme: builder.mutation<UserThemePreference, UserThemePreference>(
      {
        queryFn: async (preference) => {
          try {
            localStorage.setItem('user-theme', JSON.stringify(preference));
            return { data: preference };
          } catch (error) {
            console.error('Error updating user theme:', error);
            return {
              error: { status: 500, data: 'Failed to update user theme' },
            };
          }
        },
        invalidatesTags: ['UserTheme'],
      }
    ),
  }),
});

export const {
  useGetSystemThemeQuery,
  useUpdateSystemThemeMutation,
  useResetSystemThemeMutation,
  useGetUserThemeQuery,
  useUpdateUserThemeMutation,
} = themeApi;
