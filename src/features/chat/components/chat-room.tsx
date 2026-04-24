import { useEffect, useRef } from 'react';

import type { RootState } from '../../../app/store';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';

import { useChatWebSocketContext } from '../hooks/use-chat-websocket-context';
import {
  useGetLatestMessagesQuery,
  useMarkAsReadMutation,
} from '../api/chat-api';
import {
  clearTypingUsers,
  clearUnreadCount,
  setMessages,
  updatePartnerReadAt,
} from '../slices/chat-slice';
import { ChatHeader } from './chat-header';
import { MessageList } from './message-list';
import { MessageInput } from './message-input';

export const ChatRoom = () => {
  const dispatch = useAppDispatch();
  const { joinRoom, leaveRoom, markAsRead } = useChatWebSocketContext();
  const { selectedChatRoomId, messages, chatRooms } = useAppSelector(
    (state: RootState) => state.chat
  );
  const currentUser = useAppSelector((state: RootState) => state.auth.user);
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

  // 초기 메시지 로드 — 채팅방 진입 시 최신 메시지 50개를 API로 조회
  const { data: latestMessages } = useGetLatestMessagesQuery(
    { roomId: selectedChatRoomId!, limit: 50 },
    { skip: !selectedChatRoomId }
  );

  useEffect(() => {
    if (!selectedChatRoomId || !latestMessages?.messages) return;
    dispatch(
      setMessages({
        roomId: selectedChatRoomId,
        messages: latestMessages.messages,
      })
    );
  }, [selectedChatRoomId, latestMessages, dispatch]);

  useEffect(() => {
    if (!selectedChatRoomId) return;

    // 파트너의 lastReadAt 초기값 설정 — 내 메시지의 읽음 표시(1) 초기 렌더링에 필요
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

    // 입장 처리: presence 이벤트 전송 + 읽음 처리 (STOMP + REST 이중 처리)
    joinRoom(selectedChatRoomId);
    markAsRead(selectedChatRoomId);
    markAsReadApi(selectedChatRoomId);
    dispatch(clearUnreadCount(selectedChatRoomId));

    // 퇴장 처리: 다른 방 선택 또는 언마운트 시 실행
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

  // 채팅방에 머물고 있는 동안 새 메시지가 오면 즉시 읽음 처리
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
    <div className="flex h-full flex-col rounded-xl bg-white">
      <ChatHeader />
      <MessageList />
      <MessageInput />
    </div>
  );
};
