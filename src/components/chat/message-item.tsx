import React from 'react';
import type { MessageResponse } from '../../types/chatTypes';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';

interface MessageItemProps {
  message: MessageResponse;
  showDateSeparator?: boolean;
  date?: string;
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

const MessageItem: React.FC<MessageItemProps> = ({
  message,
  showDateSeparator,
  date,
}) => {
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const isMine = message.senderId === currentUser?.userId;

  return (
    <>
      {showDateSeparator && date && (
        <div className="my-4 flex items-center justify-center">
          <div className="rounded-full bg-gray-100 px-4 py-1 text-sm text-gray-600">
            {date}
          </div>
        </div>
      )}
      <div className={`mb-3 flex ${isMine ? 'justify-end' : 'justify-start'}`}>
        <div
          className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
        >
          <div
            className={`max-w-md rounded-2xl px-4 py-3 ${
              isMine
                ? 'rounded-tr-none border border-gray-200 bg-white'
                : 'rounded-tl-none bg-black text-white'
            }`}
          >
            <p className="whitespace-pre-wrap break-words text-sm">
              {message.content}
            </p>
          </div>
          <div className="mt-1 flex items-center gap-1 px-1">
            <span className="text-xs text-gray-500">
              {formatTime(message.createdAt)}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default MessageItem;
