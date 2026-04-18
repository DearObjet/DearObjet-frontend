import { useContext } from 'react';

import { ChatWebSocketContext } from './chat-websocket-context';
import type { ChatWebSocketContextType } from '../types/chat-types';

export const useChatWebSocketContext = (): ChatWebSocketContextType => {
  const context = useContext(ChatWebSocketContext);
  if (!context) {
    throw new Error(
      'useChatWebSocketContext must be used within ChatWebSocketProvider'
    );
  }
  return context;
};
