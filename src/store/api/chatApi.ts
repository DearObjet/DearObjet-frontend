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

interface GetMessagesBeforeParams {
  roomId: string;
  beforeMessageId: number;
  limit?: number;
}

interface UserListItem {
  userId: number;
  name: string;
  category: string;
  status: string;
}

export const chatApi = createApi({
  reducerPath: 'chatApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['ChatRooms', 'Messages', 'UnreadCount'],
  endpoints: (builder) => ({
    // ===== 채팅방 관련 =====

    // GET /api/user/list - 유저 조회
    getUserList: builder.query<UserListItem[], string | void>({
      query: (search = '') => `/users/list${search ? `?search=${search}` : ''}`,
      transformResponse: (response: ApiResponse<UserListItem[]>) =>
        response.data,
    }),

    // GET /api/chat/rooms - 채팅방 목록 조회
    getChatRooms: builder.query<ChatRoomResponse[], void>({
      query: () => '/chat/rooms',
      transformResponse: (response: ApiResponse<ChatRoomResponse[]>) =>
        response.data,
      providesTags: ['ChatRooms'],
    }),

    // POST /api/chat/rooms - 채팅방 생성
    createChatRoom: builder.mutation<ChatRoomResponse, CreateChatRoomRequest>({
      query: (body) => ({
        url: '/chat/rooms',
        method: 'POST',
        body,
      }),
      transformResponse: (response: ApiResponse<ChatRoomResponse>) =>
        response.data,
      invalidatesTags: ['ChatRooms'],
    }),

    // POST /api/chat/rooms/direct/{partnerId} - 기존 채팅방 있으면 반환, 없으면 생성
    getOrCreateDirectChat: builder.mutation<ChatRoomResponse, number>({
      query: (partnerId) => ({
        url: `/chat/rooms/direct/${partnerId}`,
        method: 'POST',
      }),
      transformResponse: (response: ApiResponse<ChatRoomResponse>) =>
        response.data,
      invalidatesTags: ['ChatRooms'],
    }),

    // GET /api/chat/rooms/{roomId} - 채팅방 상세 조회
    getChatRoom: builder.query<ChatRoomResponse, string>({
      query: (roomId) => `/chat/rooms/${roomId}`,
      transformResponse: (response: ApiResponse<ChatRoomResponse>) =>
        response.data,
      providesTags: (result, error, roomId) => [
        { type: 'ChatRooms', id: roomId },
      ],
    }),

    // ===== 메시지 관련 =====

    // GET /api/chat/rooms/{roomId}/messages/latest - 최신 메시지 조회
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

    // GET /api/chat/rooms/{roomId}/messages/sync - 재접속 시 메시지 동기화
    syncMessages: builder.query<MessageSyncResponse, SyncMessagesParams>({
      query: (params) => {
        const { roomId, afterMessageId = 0, limit = 200 } = params;
        return `/chat/rooms/${roomId}/messages/sync?afterMessageId=${afterMessageId}&limit=${limit}`;
      },
      transformResponse: (response: ApiResponse<MessageSyncResponse>) =>
        response.data,
    }),

    // GET /api/chat/rooms/{roomId}/messages/before - 과거 메시지 조회
    getMessagesBefore: builder.query<
      MessageSyncResponse,
      GetMessagesBeforeParams
    >({
      query: (params) => {
        const { roomId, beforeMessageId, limit = 50 } = params;
        return `/chat/rooms/${roomId}/messages/before?beforeMessageId=${beforeMessageId}&limit=${limit}`;
      },
      transformResponse: (response: ApiResponse<MessageSyncResponse>) =>
        response.data,
    }),

    // ===== 읽지 않은 메시지 수 =====

    // GET /api/chat/unread/total - 전체 읽지 않은 메시지 수
    getTotalUnreadCount: builder.query<number, void>({
      query: () => '/chat/unread/total',
      transformResponse: (response: ApiResponse<{ totalUnread: number }>) =>
        response.data.totalUnread,
      providesTags: ['UnreadCount'],
    }),

    markAsRead: builder.mutation<void, string>({
      query: (roomId) => ({
        url: `/chat/rooms/${roomId}/read`,
        method: 'POST',
      }),
    }),

    // ===== 이미지 업로드 =====
    uploadImage: builder.mutation<{ url: string }, FormData>({
      query: (formData) => ({
        url: '/chat/upload/image',
        method: 'POST',
        body: formData,
      }),
    }),
  }),
});

export const {
  useGetUserListQuery,
  useGetChatRoomsQuery,
  useCreateChatRoomMutation,
  useGetOrCreateDirectChatMutation,
  useGetChatRoomQuery,
  useGetLatestMessagesQuery,
  useSyncMessagesQuery,
  useGetMessagesBeforeQuery,
  useGetTotalUnreadCountQuery,
  useMarkAsReadMutation,
  useUploadImageMutation,
} = chatApi;
