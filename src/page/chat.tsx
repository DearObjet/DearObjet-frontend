import React from 'react';
import { useSelector } from 'react-redux';

import type { RootState } from '../store';
import { useChatWebSocketContext } from '../hooks/useChatWebSocketContext';
import { ChatWebSocketProvider } from '../hooks/ChatWebSocketProvider';

import Aside from '../components/aside/aside';
import ChatList from '../components/chat/chat-list';
import ChatRoom from '../components/chat/chat-room';
import EmptyChat from '../components/chat/empty-chat';

const ChatPageInner: React.FC = () => {
  const { selectedChatRoomId } = useSelector((state: RootState) => state.chat);
  const { isConnected } = useChatWebSocketContext();

  return (
    <div className="flex h-screen">
      <Aside />

      {/* 메인 컨텐츠 영역 */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="px-[3.375rem] py-6">
          <nav aria-label="breadcrumb">
            <ol className="flex items-center text-lg">
              <li>
                <a className="font-medium text-neutral-900" href="/dashboard">
                  마이페이지
                </a>
              </li>
              <li
                className="font-bold text-neutral-900 before:mx-2 before:content-['/']"
                aria-current="page"
              >
                메세지
              </li>
            </ol>
          </nav>
          <h1 className="sr-only">메세지</h1>
        </header>

        {/* 채팅 영역 */}
        <div className="flex flex-1 overflow-hidden">
          {/* 왼쪽: 채팅방 목록 */}
          <div className="flex w-96 flex-col border-r border-gray-200">
            {isConnected ? (
              <ChatList />
            ) : (
              <p>서버가 불안정합니다. 다시 시도해주세요.</p>
            )}
          </div>
          {/* 오른쪽: 대화창 또는 빈 화면 */}
          <div className="flex-1">
            {selectedChatRoomId ? <ChatRoom /> : <EmptyChat />}
          </div>
        </div>
      </div>
    </div>
  );
};

const ChatPage: React.FC = () => (
  <ChatWebSocketProvider>
    <ChatPageInner />
  </ChatWebSocketProvider>
);

export default ChatPage;
