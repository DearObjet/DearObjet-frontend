import { createApi } from '@reduxjs/toolkit/query/react';

import { createBaseQuery } from '../../../../shared/constants';

import { STORY_ENDPOINTS } from '../constants/story-constants';
import type {
  CreateStoryRequest,
  StoryListResponse,
  StoryResponse,
  UpdateStoryRequest,
} from '../types/story-types';

export const storyApi = createApi({
  reducerPath: 'storyApi',
  baseQuery: createBaseQuery(),
  tagTypes: ['Story'],
  endpoints: (builder) => ({
    getStories: builder.query<StoryListResponse, number>({
      query: (page) => ({
        url: STORY_ENDPOINTS.STORIES,
        method: 'GET',
        params: { page },
      }),
      transformResponse: (response: { data: StoryListResponse }) =>
        response.data,
      providesTags: ['Story'],
    }),
    createStory: builder.mutation<StoryResponse, CreateStoryRequest>({
      query: ({ title, content, thumbnailImage }) => {
        const formData = new FormData();
        const request = new Blob([JSON.stringify({ title, content })], {
          type: 'application/json',
        });
        formData.append('request', request);
        formData.append('thumbnailImage', thumbnailImage);
        return {
          url: STORY_ENDPOINTS.STORIES,
          method: 'POST',
          body: formData,
        };
      },
      transformResponse: (response: { data: StoryResponse }) => response.data,
    }),
    updateStory: builder.mutation<StoryResponse, UpdateStoryRequest>({
      query: ({ storyId, title, content, thumbnailImage }) => {
        const formData = new FormData();
        const request = new Blob([JSON.stringify({ title, content })], {
          type: 'application/json',
        });
        formData.append('request', request);
        if (thumbnailImage) {
          formData.append('thumbnailImage', thumbnailImage);
        }
        return {
          url: `${STORY_ENDPOINTS.STORIES}/${storyId}`,
          method: 'PUT',
          body: formData,
        };
      },
      transformResponse: (response: { data: StoryResponse }) => response.data,
    }),
    deleteStory: builder.mutation<void, number>({
      query: (storyId) => ({
        url: `${STORY_ENDPOINTS.STORIES}/${storyId}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useLazyGetStoriesQuery,
  useCreateStoryMutation,
  useUpdateStoryMutation,
  useDeleteStoryMutation,
} = storyApi;
