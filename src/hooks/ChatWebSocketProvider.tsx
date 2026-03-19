import React from 'react';
import { useChatWebSocket } from './useChatWebSocket';
import { ChatWebSocketContext } from './ChatWebSocketContext';

export const ChatWebSocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const webSocket = useChatWebSocket();

  return (
    <ChatWebSocketContext.Provider value={webSocket}>
      {children}
    </ChatWebSocketContext.Provider>
  );
};
