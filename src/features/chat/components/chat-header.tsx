import { useMemo } from 'react';

import type { RootState } from '../../../app/store';
import { useAppSelector } from '../../../app/hooks';

import LeftShiftIcon from '../../../assets/left-shift.svg';

import { useGetChatRoomQuery } from '../api/chat-api';

interface ChatHeaderProps {
  onBack?: () => void;
}

export const ChatHeader = ({ onBack }: ChatHeaderProps) => {
  const { chatRooms, selectedChatRoomId } = useAppSelector(
    (state: RootState) => state.chat
  );

  // 선택된 채팅방 찾기
  const roomFromStore = useMemo(
    () => chatRooms.find((room) => room.roomId === selectedChatRoomId),
    [chatRooms, selectedChatRoomId]
  );

  // 새로 생성된 채팅방은 getChatRooms 리패치 완료 전까지 Redux에 없음
  // roomId로 직접 조회해서 폴백 처리
  const { data: roomFromApi } = useGetChatRoomQuery(selectedChatRoomId!, {
    skip: !selectedChatRoomId || !!roomFromStore,
  });

  const selectedChatRoom = roomFromStore ?? roomFromApi;

  if (!selectedChatRoom) return null;

  const { partnerName, partnerProfileImage } = selectedChatRoom;

  const handleViewProfile = () => {
    console.log('View Profile:', partnerName);
  };

  return (
    <div className="border-b border-theme-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* 프로필 정보 */}
        <div className="flex items-center gap-3">
          {/* 프로필 이미지 */}
          {onBack && (
            <button
              onClick={onBack}
              className="text-theme-600 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg transition-colors hover:bg-theme-100 hover:text-theme-900"
              aria-label="뒤로가기"
            >
              <img src={LeftShiftIcon} alt="뒤로가기" className="h-4 w-4" />
            </button>
          )}
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
