import { memo, useMemo } from 'react';

import { useAppSelector } from '../../../app/hooks';

import type { MessageItemProps } from '../types/chat-types';

const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'pm' : 'am';
  const formattedHours = hours % 12 || 12;
  const formattedMinutes = minutes.toString().padStart(2, '0');
  return `${formattedHours}:${formattedMinutes} ${ampm}`;
};

const MessageItemComponent = ({
  message,
  showDateSeparator,
  date,
}: MessageItemProps) => {
  const currentUserId = useAppSelector((state) => state.auth.user?.userId);

  const selectedChatRoomId = useAppSelector(
    (state) => state.chat.selectedChatRoomId
  );

  // 상대방의 마지막 읽음 시각 — 내 메시지의 읽음 표시(1) 계산에 사용
  const partnerLastReadAt = useAppSelector((state) =>
    selectedChatRoomId
      ? state.chat.partnerLastReadAt?.[selectedChatRoomId]
      : null
  );

  // 내가 보낸 메시지인지 여부
  const isMine = message.senderId === currentUserId;

  // 읽지 않음 여부 (내 메세지, partnerLastReadAt 없는 경우, 메세지 생성 시각이 partnerLastReadAt보다 이후인 경우)
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
      {/* 날짜 구분선 */}
      {showDateSeparator && date && (
        <div className="my-4 flex items-center justify-center">
          <div className="rounded-full bg-theme-200 px-4 py-1 text-sm text-theme-700">
            {date}
          </div>
        </div>
      )}

      <div className={`mb-3 flex ${isMine ? 'justify-end' : 'justify-start'}`}>
        <div
          className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
        >
          <div className="flex items-end gap-1">
            {/* 읽지 않음 표시 */}
            {isMine && isUnread && (
              <span className="mb-1 text-xs text-yellow-500">1</span>
            )}

            {/* 메시지 버블 */}
            <div
              className={`max-w-md rounded-2xl px-4 py-3 ${
                isMine
                  ? 'rounded-tr-none border bg-theme-200'
                  : 'rounded-tl-none bg-black text-white'
              }`}
            >
              <p className="whitespace-pre-wrap break-words text-sm">
                {message.content}
              </p>
            </div>
          </div>

          <div className="mt-1 flex items-center gap-1 px-1">
            <span className="text-xs text-theme-900">{formattedTime}</span>
          </div>
        </div>
      </div>
    </>
  );
};

export const MessageItem = memo(MessageItemComponent);
