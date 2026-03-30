import { createContext } from 'react';

import { useChatWebSocket } from './useChatWebSocket';

type ChatWebSocketContextType = ReturnType<typeof useChatWebSocket>;

export const ChatWebSocketContext =
  createContext<ChatWebSocketContextType | null>(null);
