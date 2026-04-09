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
  }),
});

export const { useGetClassesQuery, useCreateClassMutation } = classApi;
