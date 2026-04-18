import type { ReactNode } from 'react';

import { useChatWebSocket } from './use-chat-websocket';
import { ChatWebSocketContext } from './chat-websocket-context';

export const ChatWebSocketProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const webSocket = useChatWebSocket();

  return (
    <ChatWebSocketContext.Provider value={webSocket}>
      {children}
    </ChatWebSocketContext.Provider>
  );
};
