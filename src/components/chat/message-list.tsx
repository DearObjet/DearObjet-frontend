import React, {
  useEffect,
  useRef,
  useMemo,
  useState,
  useCallback,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';

import type { AppDispatch, RootState } from '../../store';
import { useGetMessagesBeforeQuery } from '../../store/api/chatApi';
import { prependMessages } from '../../store/slices/chat-slice';

import MessageItem from './message-item';
import TypingIndicator from './typing-indicator';

const MessageList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { selectedChatRoomId, messages, typingUsers, chatRooms } = useSelector(
    (state: RootState) => state.chat
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const prevScrollHeightRef = useRef<number>(0);
  const isLoadingMoreRef = useRef(false);
  const isInitialLoadRef = useRef(true);
  const isAtBottomLocalRef = useRef(true);

  const [oldestMessageId, setOldestMessageId] = useState<number | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [beforeMessageId, setBeforeMessageId] = useState<number | null>(null);
  const [isAtBottomLocal, setIsAtBottomLocal] = useState(true);

  const partnerName = chatRooms.find(
    (room) => room.roomId === selectedChatRoomId
  )?.partnerName;

  const currentMessages = useMemo(
    () => (selectedChatRoomId ? messages[selectedChatRoomId] || [] : []),
    [selectedChatRoomId, messages]
  );

  const isPartnerTyping = useMemo(() => {
    if (!selectedChatRoomId) return false;
    return (typingUsers[selectedChatRoomId] || []).length > 0;
  }, [selectedChatRoomId, typingUsers]);

  // 채팅방 변경 시 초기화
  useEffect(() => {
    setOldestMessageId(null);
    setHasMore(true);
    setBeforeMessageId(null);
    setIsAtBottomLocal(true);
    isLoadingMoreRef.current = false;
    isInitialLoadRef.current = true;
  }, [selectedChatRoomId]);

  // 메시지 변경 시 스크롤 처리
  useEffect(() => {
    if (currentMessages.length === 0) return;

    if (isInitialLoadRef.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
      setOldestMessageId(currentMessages[0].id);
      isInitialLoadRef.current = false;
      return;
    }

    if (isLoadingMoreRef.current) {
      const container = containerRef.current;
      if (container) {
        container.scrollTop =
          container.scrollHeight - prevScrollHeightRef.current;
      }
      isLoadingMoreRef.current = false;
      return;
    }

    // 최하단일 때만 스크롤
    if (isAtBottomLocalRef.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentMessages]);

  // 이전 메시지 조회
  const { data: olderMessages } = useGetMessagesBeforeQuery(
    { roomId: selectedChatRoomId!, beforeMessageId: beforeMessageId! },
    { skip: !selectedChatRoomId || !beforeMessageId }
  );

  useEffect(() => {
    if (!olderMessages || !selectedChatRoomId) return;

    if (olderMessages.messages.length === 0) {
      setHasMore(false);
      isLoadingMoreRef.current = false;
      return;
    }

    dispatch(
      prependMessages({
        roomId: selectedChatRoomId,
        messages: olderMessages.messages,
      })
    );
    setOldestMessageId(olderMessages.messages[0].id);
    setBeforeMessageId(null);
  }, [olderMessages, selectedChatRoomId, dispatch]);

  const scrollToBottom = useCallback(
    (behavior: 'smooth' | 'auto' = 'smooth') => {
      messagesEndRef.current?.scrollIntoView({ behavior });
    },
    []
  );

  useEffect(() => {
    if (!isPartnerTyping) return;
    if (!isAtBottomLocalRef.current) return;
    scrollToBottom('smooth');
  }, [isPartnerTyping, scrollToBottom]);

  const handleScroll = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const atBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight <
      50;
    setIsAtBottomLocal(atBottom);
    isAtBottomLocalRef.current = atBottom;

    if (!hasMore || isLoadingMoreRef.current || !oldestMessageId) return;
    if (container.scrollTop === 0) {
      prevScrollHeightRef.current = container.scrollHeight;
      isLoadingMoreRef.current = true;
      setBeforeMessageId(oldestMessageId);
    }
  }, [hasMore, oldestMessageId]);

  const formatDate = useCallback((dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
  }, []);

  const groupMessagesByDate = useMemo(() => {
    const grouped: { [date: string]: typeof currentMessages } = {};
    currentMessages.forEach((message) => {
      const date = new Date(message.createdAt).toDateString();
      if (!grouped[date]) grouped[date] = [];
      grouped[date].push(message);
    });
    return grouped;
  }, [currentMessages]);

  if (!selectedChatRoomId) return null;

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="flex-1 overflow-y-auto bg-blue-300 px-6"
    >
      {isLoadingMoreRef.current && (
        <div className="flex justify-center py-2">
          <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-gray-400" />
        </div>
      )}

      {!hasMore && currentMessages.length > 0 && (
        <div className="py-2 text-center text-xs text-gray-400">
          모든 메시지를 불러왔어요
        </div>
      )}

      {Object.entries(groupMessagesByDate).map(([dateKey, msgs]) => (
        <React.Fragment key={dateKey}>
          {msgs.map((message, index) => (
            <MessageItem
              key={message.id}
              message={message}
              showDateSeparator={index === 0}
              date={index === 0 ? formatDate(message.createdAt) : undefined}
            />
          ))}
        </React.Fragment>
      ))}

      {/*  타이핑 & 타이핑 인디케이터 표시 */}
      {isPartnerTyping &&
        (isAtBottomLocal ? (
          <TypingIndicator />
        ) : (
          <div className="sticky bottom-0 mb-3 bg-white px-4 py-2 text-xs text-gray-500">
            {partnerName}님이 메세지를 입력하고 있습니다.
          </div>
        ))}

      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
