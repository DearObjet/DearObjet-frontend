import React from 'react';
import type { ChatRoomResponse } from '../../types/chatTypes';

interface ChatListItemProps {
  chatRoom: ChatRoomResponse;
  isSelected: boolean;
  onClick: () => void;
}

const formatTime = (dateString: string): string => {
  const date = new Date(dateString);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'pm' : 'am';
  const formattedHours = hours % 12 || 12;
  const formattedMinutes = minutes.toString().padStart(2, '0');
  return `${formattedHours}:${formattedMinutes} ${ampm}`;
};

const ChatListItem: React.FC<ChatListItemProps> = ({
  chatRoom,
  isSelected,
  onClick,
}) => {
  const {
    partnerName,
    partnerProfileImage,
    lastMessage,
    lastMessageAt,
    unreadCount,
  } = chatRoom;

  return (
    <div
      onClick={onClick}
      className={`flex cursor-pointer items-center gap-3 border-b border-gray-100 p-4 transition-colors hover:bg-gray-50 ${
        isSelected ? 'bg-gray-100' : 'bg-white'
      }`}
    >
      <div className="relative flex-shrink-0">
        <div className="h-12 w-12 overflow-hidden rounded-lg bg-gray-300">
          {partnerProfileImage ? (
            <img
              src={partnerProfileImage}
              alt={partnerName}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-lg font-medium text-gray-500">
              {partnerName?.charAt(0)}
            </div>
          )}
        </div>
      </div>
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-center justify-between">
          <h3 className="truncate font-medium text-gray-900">{partnerName}</h3>
          <span className="ml-2 flex-shrink-0 text-xs text-gray-500">
            {lastMessageAt ? formatTime(lastMessageAt) : ''}
          </span>
        </div>
        <p className="truncate text-sm text-gray-600">
          {lastMessage || '메시지가 없습니다'}
        </p>
      </div>
      {unreadCount > 0 && (
        <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-black text-xs text-white">
          {unreadCount}
        </div>
      )}
    </div>
  );
};

export default ChatListItem;
