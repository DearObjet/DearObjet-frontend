import { createApi } from '@reduxjs/toolkit/query/react';

import type {
  CreateClassRequest,
  CreateClassResponse,
  ClassListResponse,
} from '../types/class';
import { createBaseQuery } from '../../../../shared/constants';
import { CLASS_ENDPOINTS } from '../constants/class-constants';

export const classApi = createApi({
  reducerPath: 'classApi',
  baseQuery: createBaseQuery(),
  tagTypes: ['Class'],
  endpoints: (builder) => ({
    getClasses: builder.query<ClassListResponse, void>({
      query: () => ({
        url: CLASS_ENDPOINTS.CLASSES,
        method: 'GET',
      }),
      providesTags: ['Class'],
    }),
    getClass: builder.query<CreateClassResponse, number>({
      query: (classId) => ({
        url: `${CLASS_ENDPOINTS.CLASSES}/${classId}`,
        method: 'GET',
      }),
      providesTags: ['Class'],
    }),
    createClass: builder.mutation<CreateClassResponse, CreateClassRequest>({
      query: (arg) => {
        const formData = new FormData();

        const request = new Blob(
          [
            JSON.stringify({
              className: arg.className,
              classDescription: arg.classDescription,
              price: arg.price,
              maxCapacity: arg.maxCapacity,
              notes: arg.notes,
            }),
          ],
          { type: 'application/json' }
        );

        formData.append('request', request);
        arg.classImageFiles?.forEach((file) => {
          formData.append('classImageFiles', file);
        });

        return {
          url: CLASS_ENDPOINTS.CLASSES,
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: ['Class'],
    }),
    updateClass: builder.mutation<
      CreateClassResponse,
      CreateClassRequest & { classId: number }
    >({
      query: (arg) => {
        const formData = new FormData();

        const request = new Blob(
          [
            JSON.stringify({
              className: arg.className,
              classDescription: arg.classDescription,
              price: arg.price,
              maxCapacity: arg.maxCapacity,
              notes: arg.notes,
            }),
          ],
          { type: 'application/json' }
        );

        formData.append('request', request);
        arg.classImageFiles?.forEach((file) => {
          formData.append('classImageFiles', file);
        });

        return {
          url: `${CLASS_ENDPOINTS.CLASSES}/${arg.classId}`,
          method: 'PUT',
          body: formData,
        };
      },
      invalidatesTags: ['Class'],
    }),
    deleteClass: builder.mutation<void, number>({
      query: (classId) => ({
        url: `${CLASS_ENDPOINTS.CLASSES}/${classId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Class'],
    }),
  }),
});

export const {
  useGetClassesQuery,
  useGetClassQuery,
  useCreateClassMutation,
  useUpdateClassMutation,
  useDeleteClassMutation,
} = classApi;
