import { createContext } from 'react';

import type { ChatWebSocketContextType } from '../types/chat-types';

export const ChatWebSocketContext =
  createContext<ChatWebSocketContextType | null>(null);
