export type MessageType = 'TEXT' | 'IMAGE' | 'FILE' | 'SYSTEM';
export type ChatRoomType = 'ONE_TO_ONE' | 'GROUP';

export interface Participant {
  userId: number;
  nickname: string;
  profileImageUrl: string;
  joinedAt: string;
  lastReadAt: string | null;
}

export interface ChatRoomResponse {
  id: number;
  roomId: string;
  type: ChatRoomType;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
  participants: Participant[];
  partnerName: string;
  partnerProfileImage: string;
}

export interface MessageResponse {
  id: number;
  roomId: string;
  senderId: number;
  senderName: string;
  senderProfileImage: string;
  content: string;
  messageType: MessageType;
  createdAt: string;
  isMyMessage?: boolean;
}

export interface MessageSyncResponse {
  roomId: string;
  oldestMessageId: number | null;
  latestMessageId: number | null;
  messages: MessageResponse[];
}

export interface CreateChatRoomRequest {
  type: ChatRoomType;
  participantIds: number[];
}

export interface ChatState {
  chatRooms: ChatRoomResponse[];
  selectedChatRoomId: string | null;
  messages: Record<string, MessageResponse[]>;
  typingUsers: Record<string, TypingUser[]>;
  partnerLastReadAt: Record<string, string | null>;
  loading: boolean;
  error: string | null;
}

export interface TypingUser {
  userId: number;
  userName: string;
  roomId: string;
}

export interface TypingIndicatorDto {
  roomId: string;
  userId: number;
  userName: string;
  typing: boolean;
}

export interface ReadReceiptDto {
  roomId: string;
  userId: number;
  readAt: string;
}

export interface WebSocketError {
  code: string;
  message: string;
}
