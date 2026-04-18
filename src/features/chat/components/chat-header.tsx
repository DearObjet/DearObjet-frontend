import { useMemo } from 'react';

import type { RootState } from '../../../app/store';
import { useAppSelector } from '../../../app/hooks';

export const ChatHeader = () => {
  const { chatRooms, selectedChatRoomId } = useAppSelector(
    (state: RootState) => state.chat
  );

  // 선택된 채팅방 찾기
  const selectedChatRoom = useMemo(
    () => chatRooms.find((room) => room.roomId === selectedChatRoomId),
    [chatRooms, selectedChatRoomId]
  );

  if (!selectedChatRoom) return null;

  const { partnerName, partnerProfileImage } = selectedChatRoom;

  const handleViewProfile = () => {
    console.log('View Profile:', partnerName);
  };

  return (
    <div className="border-b border-theme-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* 좌측: 프로필 정보 */}
        <div className="flex items-center gap-3">
          {/* 프로필 이미지 */}
          <div className="relative flex-shrink-0">
            <div className="h-12 w-12 overflow-hidden rounded-lg bg-theme-300">
              {partnerProfileImage ? (
                <img
                  src={partnerProfileImage}
                  alt={partnerName}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-lg font-medium text-theme-500">
                  {partnerName.charAt(0)}
                </div>
              )}
            </div>
          </div>

          {/* 이름 */}
          <div>
            <h2 className="font-semibold text-theme-900">{partnerName}</h2>
          </div>
        </div>

        {/* View Profile 버튼 */}
        <button
          onClick={handleViewProfile}
          className="rounded-lg bg-black px-4 py-2 text-sm text-white transition-colors hover:bg-theme-700"
        >
          View Profile
        </button>
      </div>
    </div>
  );
};
