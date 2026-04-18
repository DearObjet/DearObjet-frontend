import { createApi } from '@reduxjs/toolkit/query/react';

import type { ApiResponse } from '../../../shared/types';
import { createBaseQuery } from '../../../shared/constants';

import { CHAT_ENDPOINTS } from '../constants/chat-constants';
import type {
  ChatRoomResponse,
  CreateChatRoomRequest,
  GetLatestMessagesParams,
  GetMessagesBeforeParams,
  MessageSyncResponse,
  SyncMessagesParams,
  UserListItem,
} from '../types/chat-types';

export const chatApi = createApi({
  reducerPath: 'chatApi',
  baseQuery: createBaseQuery(),
  tagTypes: ['ChatRooms', 'Messages', 'UnreadCount'],
  endpoints: (builder) => ({
    // ===== 채팅방 =====

    // 유저 검색 — 새 메시지 시작 시 대화 상대 검색에 사용
    getUserList: builder.query<UserListItem[], string | void>({
      query: (search = '') =>
        search
          ? `${CHAT_ENDPOINTS.USER_LIST}?search=${search}`
          : CHAT_ENDPOINTS.USER_LIST,
      transformResponse: (response: ApiResponse<UserListItem[]>) =>
        response.data,
    }),

    // 내가 참여한 채팅방 목록 전체 조회
    getChatRooms: builder.query<ChatRoomResponse[], void>({
      query: () => CHAT_ENDPOINTS.ROOMS,
      transformResponse: (response: ApiResponse<ChatRoomResponse[]>) =>
        response.data,
      providesTags: ['ChatRooms'],
    }),

    // 채팅방 생성 (그룹 채팅방 생성이지만 현재는 이것만 사용)
    createChatRoom: builder.mutation<ChatRoomResponse, CreateChatRoomRequest>({
      query: (body) => ({
        url: CHAT_ENDPOINTS.ROOMS,
        method: 'POST',
        body,
      }),
      transformResponse: (response: ApiResponse<ChatRoomResponse>) =>
        response.data,
      invalidatesTags: ['ChatRooms'],
    }),

    // 1:1 채팅방 생성 또는 기존 방 반환
    // 동일한 상대와 채팅방이 이미 있으면 새로 만들지 않고 기존 방을 반환
    getOrCreateDirectChat: builder.mutation<ChatRoomResponse, number>({
      query: (partnerId) => ({
        url: CHAT_ENDPOINTS.DIRECT_ROOM(partnerId),
        method: 'POST',
      }),
      transformResponse: (response: ApiResponse<ChatRoomResponse>) =>
        response.data,
      invalidatesTags: ['ChatRooms'],
    }),

    // 특정 채팅방 상세 조회
    getChatRoom: builder.query<ChatRoomResponse, string>({
      query: (roomId) => CHAT_ENDPOINTS.ROOM_DETAIL(roomId),
      transformResponse: (response: ApiResponse<ChatRoomResponse>) =>
        response.data,
      providesTags: (result, error, roomId) => [
        { type: 'ChatRooms', id: roomId },
      ],
    }),

    // ===== 메시지 =====

    // 최신 메시지 조회 — 채팅방 최초 진입 시 호출 (기본 50개)
    getLatestMessages: builder.query<
      MessageSyncResponse,
      GetLatestMessagesParams
    >({
      query: ({ roomId, limit = 50 }) =>
        `${CHAT_ENDPOINTS.LATEST_MESSAGES(roomId)}?limit=${limit}`,
      transformResponse: (response: ApiResponse<MessageSyncResponse>) =>
        response.data,
      providesTags: (result, error, { roomId }) => [
        { type: 'Messages', id: roomId },
      ],
    }),

    // 재연결 시 누락 메시지 동기화 — afterMessageId 이후의 메시지를 최대 200개 조회
    syncMessages: builder.query<MessageSyncResponse, SyncMessagesParams>({
      query: ({ roomId, afterMessageId = 0, limit = 200 }) =>
        `${CHAT_ENDPOINTS.SYNC_MESSAGES(roomId)}?afterMessageId=${afterMessageId}&limit=${limit}`,
      transformResponse: (response: ApiResponse<MessageSyncResponse>) =>
        response.data,
    }),

    // 무한 스크롤 — beforeMessageId 이전의 과거 메시지 조회 (기본 50개)
    getMessagesBefore: builder.query<
      MessageSyncResponse,
      GetMessagesBeforeParams
    >({
      query: ({ roomId, beforeMessageId, limit = 50 }) =>
        `${CHAT_ENDPOINTS.MESSAGES_BEFORE(roomId)}?beforeMessageId=${beforeMessageId}&limit=${limit}`,
      transformResponse: (response: ApiResponse<MessageSyncResponse>) =>
        response.data,
    }),

    // ===== 읽지 않은 메시지 =====

    // 전체 채팅방의 읽지 않은 메시지 수 합계 (dashboard 표시용)
    getTotalUnreadCount: builder.query<number, void>({
      query: () => CHAT_ENDPOINTS.UNREAD_TOTAL,
      transformResponse: (response: ApiResponse<{ totalUnread: number }>) =>
        response.data.totalUnread,
      providesTags: ['UnreadCount'],
    }),

    // 읽음 처리 — STOMP markAsRead와 함께 이중으로 호출해 확실하게 처리
    markAsRead: builder.mutation<void, string>({
      query: (roomId) => ({
        url: CHAT_ENDPOINTS.MARK_AS_READ(roomId),
        method: 'POST',
      }),
      invalidatesTags: ['ChatRooms', 'UnreadCount'],
    }),

    // ===== 이미지 업로드 =====

    uploadImage: builder.mutation<{ url: string }, FormData>({
      query: (formData) => ({
        url: CHAT_ENDPOINTS.UPLOAD_IMAGE,
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
