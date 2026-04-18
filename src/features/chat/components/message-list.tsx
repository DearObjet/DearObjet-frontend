import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Fragment } from 'react';

import { useAppDispatch, useAppSelector } from '../../../app/hooks';

import { useGetMessagesBeforeQuery } from '../api/chat-api';
import { prependMessages } from '../slices/chat-slice';

import { MessageItem } from './message-item';
import { TypingIndicator } from './typing-indicator';

export const MessageList = () => {
  const dispatch = useAppDispatch();
  const { selectedChatRoomId, messages, typingUsers, chatRooms } =
    useAppSelector((state) => state.chat);

  const containerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null); // 스크롤 최하단 앵커
  const prevScrollHeightRef = useRef<number>(0); // 이전 메시지 로드 후 스크롤 위치 복원에 사용
  const isLoadingMoreRef = useRef(false); // 이전 메시지 로딩 중 여부
  const isInitialLoadRef = useRef(true); // 최초 진입 여부 — 첫 로드 시 스크롤을 최하단으로 즉시 이동
  const isAtBottomLocalRef = useRef(true); // 현재 스크롤이 최하단인지 여부

  const [oldestMessageId, setOldestMessageId] = useState<number | null>(null);
  const [hasMore, setHasMore] = useState(true); // 더 불러올 과거 메시지가 있는지
  const [beforeMessageId, setBeforeMessageId] = useState<number | null>(null); // 이 ID 이전 메시지 조회 트리거
  const [isAtBottomLocal, setIsAtBottomLocal] = useState(true);

  const partnerName = chatRooms.find(
    (room) => room.roomId === selectedChatRoomId
  )?.partnerName;

  // 현재 선택된 채팅방의 메시지 목록
  const currentMessages = useMemo(
    () => (selectedChatRoomId ? messages[selectedChatRoomId] || [] : []),
    [selectedChatRoomId, messages]
  );

  // 상대방이 현재 타이핑 중인지 여부
  const isPartnerTyping = useMemo(() => {
    if (!selectedChatRoomId) return false;
    return (typingUsers[selectedChatRoomId] || []).length > 0;
  }, [selectedChatRoomId, typingUsers]);

  // 채팅방 변경 시 모든 상태 초기화
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

    // 최초 진입: 스크롤을 즉시 최하단으로 이동
    if (isInitialLoadRef.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
      setOldestMessageId(currentMessages[0].id);
      isInitialLoadRef.current = false;
      return;
    }

    // 이전 메시지(50개 이상인 경우) 로드 완료: 스크롤 위치 복원 (위로 스크롤되지 않도록)
    if (isLoadingMoreRef.current) {
      const container = containerRef.current;
      if (container) {
        container.scrollTop =
          container.scrollHeight - prevScrollHeightRef.current;
      }
      isLoadingMoreRef.current = false;
      return;
    }

    // 새 메시지 수신: 최하단에 있을 때만 자동으로 최하단으로 스크롤
    if (isAtBottomLocalRef.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentMessages]);

  const { data: olderMessages } = useGetMessagesBeforeQuery(
    { roomId: selectedChatRoomId!, beforeMessageId: beforeMessageId! },
    { skip: !selectedChatRoomId || !beforeMessageId }
  );

  // 이전 메시지 로드 완료 시 Redux에 prepend
  useEffect(() => {
    if (!olderMessages || !selectedChatRoomId) return;

    // 더 이상 과거 메시지 없음
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
    setBeforeMessageId(null); // 다음 스크롤 이벤트를 위해 초기화
  }, [olderMessages, selectedChatRoomId, dispatch]);

  const scrollToBottom = useCallback(
    (behavior: 'smooth' | 'auto' = 'smooth') => {
      messagesEndRef.current?.scrollIntoView({ behavior });
    },
    []
  );

  // 타이핑 인디케이터 표시 시(스크롤이 최하단에 위치한 경우에만) 자동으로 최하단으로 스크롤
  useEffect(() => {
    if (!isPartnerTyping || !isAtBottomLocalRef.current) return;
    scrollToBottom('smooth');
  }, [isPartnerTyping, scrollToBottom]);

  // 스크롤 이벤트 핸들러
  const handleScroll = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    // 최하단 여부 판단
    const atBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight <
      50;
    setIsAtBottomLocal(atBottom);
    isAtBottomLocalRef.current = atBottom;

    // 최상단 도달 시 이전 메시지 로드 트리거
    if (!hasMore || isLoadingMoreRef.current || !oldestMessageId) return;
    if (container.scrollTop === 0) {
      prevScrollHeightRef.current = container.scrollHeight; // 현재 높이 저장
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

  // 메시지를 날짜별로 그룹화 — 날짜 구분선 표시에 사용
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
      className="flex-1 overflow-y-auto bg-white px-6"
    >
      {!hasMore && currentMessages.length > 0 && (
        <div className="py-2 text-center text-xs text-theme-900">
          모든 메시지를 불러왔어요
        </div>
      )}

      {Object.entries(groupMessagesByDate).map(([dateKey, msgs]) => (
        <Fragment key={dateKey}>
          {msgs.map((message, index) => (
            <MessageItem
              key={message.id}
              message={message}
              showDateSeparator={index === 0}
              date={index === 0 ? formatDate(message.createdAt) : undefined}
            />
          ))}
        </Fragment>
      ))}

      {isPartnerTyping &&
        (isAtBottomLocal ? (
          <TypingIndicator />
        ) : (
          <div className="sticky bottom-2 rounded-full border border-theme-200 bg-theme-100 px-4 py-2 text-center text-xs text-theme-900">
            {partnerName}님이 메세지를 입력하고 있습니다.
          </div>
        ))}

      <div ref={messagesEndRef} />
    </div>
  );
};
