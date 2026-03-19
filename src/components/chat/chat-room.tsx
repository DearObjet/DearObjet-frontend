import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../store';
import { useChatWebSocketContext } from '../../hooks/useChatWebSocketContext';
import {
  useGetLatestMessagesQuery,
  useMarkAsReadMutation,
} from '../../store/api/chatApi';
import { clearUnreadCount, setMessages } from '../../store/slices/chat-slice';
import ChatHeader from './chat-header';
import MessageList from './message-list';
import MessageInput from './message-input';

const ChatRoom: React.FC = () => {
  const dispatch = useDispatch();
  const { joinRoom, leaveRoom, markAsRead } = useChatWebSocketContext();
  const { selectedChatRoomId } = useSelector((state: RootState) => state.chat);
  const [markAsReadApi] = useMarkAsReadMutation();

  // 초기 메시지 로드
  const { data: latestMessages } = useGetLatestMessagesQuery(
    { roomId: selectedChatRoomId!, limit: 50 },
    { skip: !selectedChatRoomId }
  );

  // 메시지 로드 시 Redux에 저장
  useEffect(() => {
    if (selectedChatRoomId && latestMessages?.messages) {
      dispatch(
        setMessages({
          roomId: selectedChatRoomId,
          messages: latestMessages.messages,
        })
      );
    }
  }, [selectedChatRoomId, latestMessages, dispatch]);

  // 채팅방 입장/퇴장/읽음 처리
  useEffect(() => {
    if (!selectedChatRoomId) return;

    joinRoom(selectedChatRoomId);
    markAsRead(selectedChatRoomId);
    markAsReadApi(selectedChatRoomId);
    dispatch(clearUnreadCount(selectedChatRoomId));

    return () => {
      leaveRoom(selectedChatRoomId);
    };
  }, [
    selectedChatRoomId,
    joinRoom,
    leaveRoom,
    markAsRead,
    markAsReadApi,
    dispatch,
  ]);

  return (
    <div className="flex h-full flex-col bg-white">
      <ChatHeader />
      <MessageList />
      <MessageInput />
    </div>
  );
};

export default ChatRoom;
