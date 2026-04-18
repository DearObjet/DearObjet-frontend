import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type {
  ChatRoomResponse,
  ChatState,
  MessageResponse,
  TypingUser,
} from '../types/chat-types';

const initialState: ChatState = {
  chatRooms: [],
  selectedChatRoomId: null,
  messages: {},
  typingUsers: {},
  partnerLastReadAt: {},
  loading: false,
  error: null,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setChatRooms: (state, action: PayloadAction<ChatRoomResponse[]>) => {
      state.chatRooms = action.payload;
    },

    selectChatRoom: (state, action: PayloadAction<string | null>) => {
      state.selectedChatRoomId = action.payload;
    },

    setMessages: (
      state,
      action: PayloadAction<{ roomId: string; messages: MessageResponse[] }>
    ) => {
      const { roomId, messages } = action.payload;
      state.messages[roomId] = messages;
    },

    addMessage: (
      state,
      action: PayloadAction<{
        message: MessageResponse;
        currentUserId: number;
        skipUnreadUpdate?: boolean;
      }>
    ) => {
      const { message, currentUserId, skipUnreadUpdate } = action.payload;
      const { roomId } = message;

      // 메시지 추가
      if (!state.messages[roomId]) {
        state.messages[roomId] = [];
      }

      // 중복 체크
      const isDuplicate = state.messages[roomId].some(
        (m) => m.id === message.id
      );
      if (!isDuplicate) {
        state.messages[roomId].push(message);
      }

      // 채팅방 목록 업데이트
      const chatRoom = state.chatRooms.find((room) => room.roomId === roomId);

      if (chatRoom) {
        // lastMessage 업데이트
        chatRoom.lastMessage = message.content;
        chatRoom.lastMessageAt = message.createdAt;

        // 상대방 메시지이고, 현재 선택된 방이 아닐 때만 unreadCount 증가
        const isMyMessage = message.senderId === currentUserId;
        const isCurrentRoom = state.selectedChatRoomId === roomId;

        if (!skipUnreadUpdate && !isMyMessage && !isCurrentRoom) {
          chatRoom.unreadCount = (chatRoom.unreadCount ?? 0) + 1;
        }

        // 최신 메시지 방을 위로 정렬
        state.chatRooms.sort(
          (a, b) =>
            new Date(b.lastMessageAt).getTime() -
            new Date(a.lastMessageAt).getTime()
        );
      }
    },

    clearUnreadCount: (state, action: PayloadAction<string>) => {
      const roomId = action.payload;
      const chatRoom = state.chatRooms.find((room) => room.roomId === roomId);
      if (chatRoom) {
        chatRoom.unreadCount = 0;
      }
    },

    updatePartnerReadAt: (
      state,
      action: PayloadAction<{ roomId: string; readAt: string }>
    ) => {
      const { roomId, readAt } = action.payload;
      state.partnerLastReadAt[roomId] = readAt;
    },

    setTypingUsers: (
      state,
      action: PayloadAction<{ roomId: string; typingUsers: TypingUser[] }>
    ) => {
      const { roomId, typingUsers } = action.payload;
      state.typingUsers[roomId] = typingUsers;
    },

    clearTypingUsers: (state, action: PayloadAction<string>) => {
      const roomId = action.payload;
      state.typingUsers[roomId] = [];
    },

    prependMessages: (
      state,
      action: PayloadAction<{ roomId: string; messages: MessageResponse[] }>
    ) => {
      const { roomId, messages } = action.payload;

      if (!state.messages[roomId]) {
        state.messages[roomId] = [];
      }

      // 중복 제거 후 앞에 추가
      const existingIds = new Set(state.messages[roomId].map((m) => m.id));
      const newMessages = messages.filter((m) => !existingIds.has(m.id));
      state.messages[roomId] = [...newMessages, ...state.messages[roomId]];
    },
  },
});

export const {
  setChatRooms,
  selectChatRoom,
  setMessages,
  addMessage,
  clearUnreadCount,
  updatePartnerReadAt,
  setTypingUsers,
  clearTypingUsers,
  prependMessages,
} = chatSlice.actions;

export default chatSlice.reducer;
