import { useEffect } from 'react';

import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { selectChatRoom } from '../../../features/chat/slices/chat-slice';
import { ChatWebSocketProvider } from '../../../features/chat/hooks/chat-websocket-provider';
import { useChatWebSocketContext } from '../../../features/chat/hooks/use-chat-websocket-context';
import { ChatList } from '../../../features/chat/components/chat-list';
import { ChatRoom } from '../../../features/chat/components/chat-room';
import { MyPageLayout } from './my-page-layout';

const MyMessagesInner = () => {
  const dispatch = useAppDispatch();
  const { selectedChatRoomId } = useAppSelector((state) => state.chat);
  const { isConnected } = useChatWebSocketContext();

  // 탭 진입/이탈 시 선택된 채팅방 초기화
  useEffect(() => {
    dispatch(selectChatRoom(null));
    return () => {
      dispatch(selectChatRoom(null));
    };
  }, [dispatch]);

  const handleBack = () => dispatch(selectChatRoom(null));

  return (
    <MyPageLayout>
      <div className="h-[45rem] w-[37.5rem] overflow-hidden rounded-xl border border-theme-200 bg-white">
        {!isConnected ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-sm text-theme-500">
              서버가 불안정합니다. 다시 시도해주세요.
            </p>
          </div>
        ) : selectedChatRoomId ? (
          <ChatRoom onBack={handleBack} />
        ) : (
          <ChatList />
        )}
      </div>
    </MyPageLayout>
  );
};

export const MyMessages = () => (
  <ChatWebSocketProvider>
    <MyMessagesInner />
  </ChatWebSocketProvider>
);
