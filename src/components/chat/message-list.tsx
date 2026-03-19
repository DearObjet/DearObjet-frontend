import React, { useEffect, useRef, useMemo } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import type { MessageResponse } from '../../types/chatTypes';
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

  if (!selectedChatRoomId) return null;

  return (
    <div className="flex-1 overflow-y-auto bg-white px-6 py-4">
      {currentMessages.map((message: MessageResponse) => (
        <MessageItem key={message.id} message={message} />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
