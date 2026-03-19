import React from 'react';
import ChatHeader from './chat-header';
import MessageList from './message-list';
import MessageInput from './message-inpu';

const ChatRoom: React.FC = () => {
  return (
    <div className="flex h-full flex-col bg-white">
      <ChatHeader />
      <MessageList />
      <MessageInput />
    </div>
  );
};

export default ChatRoom;
