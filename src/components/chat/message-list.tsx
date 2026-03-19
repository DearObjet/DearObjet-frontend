import React, { useEffect, useRef, useMemo } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import MessageItem from './message-item';

const MessageList: React.FC = () => {
  const { selectedChatRoomId, messages } = useSelector(
    (state: RootState) => state.chat
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentMessages = useMemo(
    () => (selectedChatRoomId ? messages[selectedChatRoomId] || [] : []),
    [selectedChatRoomId, messages]
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';

    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}년 ${month}월 ${day}일`;
  };

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
    <div className="flex-1 overflow-y-auto bg-white px-6 py-4">
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
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
