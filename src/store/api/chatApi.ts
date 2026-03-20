import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
  ChatRoomResponse,
  MessageSyncResponse,
  CreateChatRoomRequest,
} from '../../types/chatTypes';
import type { ApiResponse } from '../../types/apiTypes';

interface GetLatestMessagesParams {
  roomId: string;
  limit?: number;
}

interface SyncMessagesParams {
  roomId: string;
  afterMessageId?: number;
  limit?: number;
}

export const chatApi = createApi({
  reducerPath: 'chatApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('accessToken');
      if (token) headers.set('Authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ['ChatRooms', 'Messages'],
  endpoints: (builder) => ({
    getChatRooms: builder.query<ChatRoomResponse[], void>({
      query: () => '/chat/rooms',
      transformResponse: (response: ApiResponse<ChatRoomResponse[]>) =>
        response.data,
      providesTags: ['ChatRooms'],
    }),

    createChatRoom: builder.mutation<ChatRoomResponse, CreateChatRoomRequest>({
      query: (body) => ({ url: '/chat/rooms', method: 'POST', body }),
      transformResponse: (response: ApiResponse<ChatRoomResponse>) =>
        response.data,
      invalidatesTags: ['ChatRooms'],
    }),

    getOrCreateDirectChat: builder.mutation<ChatRoomResponse, number>({
      query: (partnerId) => ({
        url: `/chat/rooms/direct/${partnerId}`,
        method: 'POST',
      }),
      transformResponse: (response: ApiResponse<ChatRoomResponse>) =>
        response.data,
      invalidatesTags: ['ChatRooms'],
    }),

    getLatestMessages: builder.query<
      MessageSyncResponse,
      GetLatestMessagesParams
    >({
      query: ({ roomId, limit = 50 }) =>
        `/chat/rooms/${roomId}/messages/latest?limit=${limit}`,
      transformResponse: (response: ApiResponse<MessageSyncResponse>) =>
        response.data,
      providesTags: (result, error, { roomId }) => [
        { type: 'Messages', id: roomId },
      ],
    }),

    markAsRead: builder.mutation<void, string>({
      query: (roomId) => ({
        url: `/chat/rooms/${roomId}/read`,
        method: 'POST',
      }),
    }),

    syncMessages: builder.query<MessageSyncResponse, SyncMessagesParams>({
      query: ({ roomId, afterMessageId = 0, limit = 200 }) =>
        `/chat/rooms/${roomId}/messages/sync?afterMessageId=${afterMessageId}&limit=${limit}`,
      transformResponse: (response: ApiResponse<MessageSyncResponse>) =>
        response.data,
    }),
  }),
});

export const {
  useGetChatRoomsQuery,
  useCreateChatRoomMutation,
  useGetOrCreateDirectChatMutation,
  useGetLatestMessagesQuery,
  useMarkAsReadMutation,
  useSyncMessagesQuery,
} = chatApi;
