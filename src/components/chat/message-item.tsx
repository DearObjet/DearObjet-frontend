import React, { memo, useMemo } from 'react';
import { useSelector } from 'react-redux';

import type { RootState } from '../../store';
import type { MessageResponse } from '../../types/chatTypes';

interface MessageItemProps {
  message: MessageResponse;
  showDateSeparator?: boolean;
  date?: string;
}

const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'pm' : 'am';
  const formattedHours = hours % 12 || 12;
  const formattedMinutes = minutes.toString().padStart(2, '0');
  return `${formattedHours}:${formattedMinutes} ${ampm}`;
};

const MessageItem: React.FC<MessageItemProps> = memo(
  ({ message, showDateSeparator, date }) => {
    const currentUserId = useSelector(
      (state: RootState) => state.auth.user?.userId
    );
    const selectedChatRoomId = useSelector(
      (state: RootState) => state.chat.selectedChatRoomId
    );
    const partnerLastReadAt = useSelector((state: RootState) =>
      selectedChatRoomId
        ? state.chat.partnerLastReadAt?.[selectedChatRoomId]
        : null
    );

    // 메세지 발신인 구분
    const isMine = message.senderId === currentUserId;

    // 읽지 않음 여부
    const isUnread = useMemo(
      () =>
        isMine &&
        (!partnerLastReadAt ||
          new Date(message.createdAt) > new Date(partnerLastReadAt)),
      [isMine, partnerLastReadAt, message.createdAt]
    );

    const formattedTime = useMemo(
      () => formatTime(message.createdAt),
      [message.createdAt]
    );

    return (
      <>
        {showDateSeparator && date && (
          <div className="my-4 flex items-center justify-center">
            <div className="rounded-full bg-gray-100 px-4 py-1 text-sm text-gray-600">
              {date}
            </div>
          </div>
        )}

        <div
          className={`mb-3 flex ${isMine ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
          >
            {/* 메시지 버블 + 미읽음 숫자 */}
            <div className="flex items-end gap-1">
              {/* 미읽음 숫자 (내 메시지 왼쪽) */}
              {isMine && isUnread && (
                <span className="mb-1 text-xs text-yellow-500">1</span>
              )}

              {/* 메시지 버블 */}
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
            </div>

            {/* 시간 표시 */}
            <div className="mt-1 flex items-center gap-1 px-1">
              <span className="text-xs text-gray-500">{formattedTime}</span>
            </div>
          </div>
        </div>
      </>
    );
  }
);

MessageItem.displayName = 'MessageItem';

export default MessageItem;
