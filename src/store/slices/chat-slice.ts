import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type {
  ChatState,
  ChatRoomResponse,
  MessageResponse,
  TypingUser,
} from '../../types/chatTypes';

const initialState: ChatState = {
  chatRooms: [],
  selectedChatRoomId: null,
  messages: {},
  typingUsers: {},
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

    addMessage: (state, action: PayloadAction<MessageResponse>) => {
      const message = action.payload;
      const { roomId } = message;

      if (!state.messages[roomId]) {
        state.messages[roomId] = [];
      }

      const isDuplicate = state.messages[roomId].some(
        (m) => m.id === message.id
      );
      if (!isDuplicate) {
        state.messages[roomId].push(message);
      }

      const chatRoom = state.chatRooms.find((room) => room.roomId === roomId);
      if (chatRoom) {
        chatRoom.lastMessage = message.content;
        chatRoom.lastMessageAt = message.createdAt;
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
  },
});

export const {
  setChatRooms,
  selectChatRoom,
  setMessages,
  addMessage,
  clearUnreadCount,
  setTypingUsers,
  clearTypingUsers,
} = chatSlice.actions;

export default chatSlice.reducer;
