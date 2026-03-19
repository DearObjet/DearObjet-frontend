import { useContext } from 'react';
import { ChatWebSocketContext } from './ChatWebSocketContext';
import { useChatWebSocket } from './useChatWebSocket';

type ChatWebSocketContextType = ReturnType<typeof useChatWebSocket>;

export const useChatWebSocketContext = (): ChatWebSocketContextType => {
  const context = useContext(ChatWebSocketContext);
  if (!context) {
    throw new Error(
      'useChatWebSocketContext must be used within ChatWebSocketProvider'
    );
  }
  return context;
};
