import React, { memo } from 'react';

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

const ChatListItem: React.FC<ChatListItemProps> = memo(
  ({ chatRoom, isSelected, onClick }) => {
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
        className={`flex cursor-pointer items-center gap-3 border-b border-gray-100 p-4 transition-colors hover:bg-gray-50 ${isSelected ? 'bg-red-300' : 'bg-white'}`}
      >
        {/* 프로필 이미지 */}
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
                {partnerName.charAt(0)}
              </div>
            )}
          </div>
        </div>

        {/* 채팅방 정보 */}
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center justify-between">
            <h3 className="truncate font-medium text-gray-900">
              {partnerName}
            </h3>
            <span className="ml-2 flex-shrink-0 text-xs text-gray-500">
              {formatTime(lastMessageAt)}
            </span>
          </div>
          <p className="truncate text-sm text-gray-600">
            {lastMessage || `${partnerName}님과 대화를 시작해보세요!`}
          </p>
        </div>

        {/* 읽지 않은 메시지 수 */}
        {unreadCount > 0 && (
          <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-black text-xs text-white">
            {unreadCount}
          </div>
        )}
      </div>
    );
  }
);

ChatListItem.displayName = 'ChatListItem';

export default ChatListItem;
