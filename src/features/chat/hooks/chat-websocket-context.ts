import { createContext } from 'react';

import { useChatWebSocket } from './use-chat-websocket';

type ChatWebSocketContextType = ReturnType<typeof useChatWebSocket>;

export const ChatWebSocketContext =
  createContext<ChatWebSocketContextType | null>(null);
