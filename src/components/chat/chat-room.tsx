import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import type { RootState } from '../../store';
import { useChatWebSocketContext } from '../../hooks/useChatWebSocketContext';
import {
  useGetLatestMessagesQuery,
  useMarkAsReadMutation,
} from '../../store/api/chatApi';
import {
  clearTypingUsers,
  clearUnreadCount,
  setMessages,
  updatePartnerReadAt,
} from '../../store/slices/chat-slice';

import ChatHeader from './chat-header';
import MessageList from './message-list';
import MessageInput from './message-input';

const ChatRoom: React.FC = () => {
  const dispatch = useDispatch();
  const { joinRoom, leaveRoom, markAsRead } = useChatWebSocketContext();
  const { selectedChatRoomId, messages, chatRooms } = useSelector(
    (state: RootState) => state.chat
  );
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const [markAsReadApi] = useMarkAsReadMutation();
  const currentMessages = selectedChatRoomId
    ? messages[selectedChatRoomId]
    : null;
  const chatRoomsRef = useRef(chatRooms);
  const currentUserRef = useRef(currentUser);

  useEffect(() => {
    chatRoomsRef.current = chatRooms;
  }, [chatRooms]);
  useEffect(() => {
    currentUserRef.current = currentUser;
  }, [currentUser]);

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

    // 파트너의 lastReadAt 초기값 설정
    const chatRoom = chatRoomsRef.current.find(
      (r) => r.roomId === selectedChatRoomId
    );
    const partner = chatRoom?.participants.find(
      (p) => p.userId !== currentUserRef.current?.userId
    );
    if (partner?.lastReadAt) {
      dispatch(
        updatePartnerReadAt({
          roomId: selectedChatRoomId,
          readAt: partner.lastReadAt,
        })
      );
    }

    joinRoom(selectedChatRoomId);
    markAsRead(selectedChatRoomId);
    markAsReadApi(selectedChatRoomId);
    dispatch(clearUnreadCount(selectedChatRoomId));

    return () => {
      leaveRoom(selectedChatRoomId);
      dispatch(clearTypingUsers(selectedChatRoomId));
    };
  }, [
    selectedChatRoomId,
    joinRoom,
    leaveRoom,
    markAsRead,
    markAsReadApi,
    dispatch,
  ]);

  // 채팅방에 있는 동안 새 메시지가 오면 자동 읽음 처리
  useEffect(() => {
    if (!selectedChatRoomId || !currentMessages?.length) return;
    markAsRead(selectedChatRoomId);
    markAsReadApi(selectedChatRoomId);
    dispatch(clearUnreadCount(selectedChatRoomId));
  }, [
    currentMessages?.length,
    selectedChatRoomId,
    dispatch,
    markAsRead,
    markAsReadApi,
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
