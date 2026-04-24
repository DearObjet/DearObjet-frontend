import { useAppSelector } from '../../../app/hooks';

import { ChatWebSocketProvider } from '../hooks/chat-websocket-provider';
import { useChatWebSocketContext } from '../hooks/use-chat-websocket-context';

import { ChatList } from '../components/chat-list';
import { ChatRoom } from '../components/chat-room';
import { EmptyChat } from '../components/empty-chat';

const ChatPageInner = () => {
  const { selectedChatRoomId } = useAppSelector((state) => state.chat);
  const { isConnected } = useChatWebSocketContext();

  return (
    <div className="flex h-[52.2rem] flex-1 gap-3 overflow-hidden bg-gray-100">
      <section className="flex w-96 flex-col rounded-xl border-r border-gray-200">
        {isConnected ? (
          <ChatList />
        ) : (
          <p>서버가 불안정합니다. 다시 시도해주세요.</p>
        )}
      </section>
      <section className="flex-1">
        {selectedChatRoomId ? <ChatRoom /> : <EmptyChat />}
      </section>
    </div>
  );
};

export const Chat = () => (
  <ChatWebSocketProvider>
    <ChatPageInner />
  </ChatWebSocketProvider>
);
