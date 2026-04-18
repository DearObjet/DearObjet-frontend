export const CHAT_ENDPOINTS = {
  // 채팅방
  ROOMS: '/api/chat/rooms',
  ROOM_DETAIL: (roomId: string) => `/api/chat/rooms/${roomId}`,
  DIRECT_ROOM: (partnerId: number) => `/api/chat/rooms/direct/${partnerId}`,
  MARK_AS_READ: (roomId: string) => `/api/chat/rooms/${roomId}/read`,

  // 메시지
  LATEST_MESSAGES: (roomId: string) =>
    `/api/chat/rooms/${roomId}/messages/latest`,
  SYNC_MESSAGES: (roomId: string) => `/api/chat/rooms/${roomId}/messages/sync`,
  MESSAGES_BEFORE: (roomId: string) =>
    `/api/chat/rooms/${roomId}/messages/before`,

  // 읽지 않은 메시지
  UNREAD_TOTAL: '/api/chat/unread/total',

  // 이미지 업로드
  UPLOAD_IMAGE: '/api/chat/upload/image',

  // 유저 검색
  USER_LIST: '/api/users/list',
} as const;
