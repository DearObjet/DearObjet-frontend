import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import type { RootState } from '../../../app/store';

import { useGetChatRoomsQuery } from '../api/chat-api';
import {
  setChatRooms,
  selectChatRoom,
  updatePartnerReadAt,
} from '../slices/chat-slice';
import { ChatListItem } from './chat-list-item';
import { UserSelectModal } from './user-select-modal';

export const ChatList = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const { selectedChatRoomId, chatRooms } = useSelector(
    (state: RootState) => state.chat
  );
  const { data, isLoading, error } = useGetChatRoomsQuery();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 채팅방 목록 로드 완료 시 Redux에 저장 + 파트너 읽음 시각 초기화
  useEffect(() => {
    if (!data) return;

    dispatch(setChatRooms(data));

    // 내 메시지의 읽음 표시(1)
    data.forEach((chatRoom) => {
      const partner = chatRoom.participants.find(
        (p) => p.userId !== currentUser?.userId
      );
      if (partner?.lastReadAt) {
        dispatch(
          updatePartnerReadAt({
            roomId: chatRoom.roomId,
            readAt: partner.lastReadAt,
          })
        );
      }
    });
  }, [data, dispatch, currentUser]);

  const handleSelectRoom = useCallback(
    (roomId: string) => dispatch(selectChatRoom(roomId)),
    [dispatch]
  );

  return (
    <div className="flex h-full flex-col bg-white">
      <div className="border-b border-theme-200 p-4">
        {/* 새 메세지 버튼 */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="mb-4 flex w-full items-center justify-center gap-2 rounded-lg bg-black py-3 text-sm font-medium text-white transition-colors hover:bg-gray-800"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          새 메세지
        </button>

        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">Contacts</h2>
          <span className="text-sm text-gray-500">{chatRooms.length}</span>
        </div>

        {/* 검색 바 */}
        <div className="relative">
          <input
            type="text"
            placeholder="검색"
            className="w-full rounded-lg border border-gray-200 py-2 pl-10 pr-4 text-sm focus:border-gray-400 focus:outline-none"
          />
          <svg
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* 채팅방 목록 */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900" />
          </div>
        ) : error ? (
          <div className="flex h-full items-center justify-center p-4">
            <p className="text-center text-red-500">
              채팅방 목록을 불러오는데 실패했습니다.
            </p>
          </div>
        ) : chatRooms.length === 0 ? (
          <div className="flex h-full items-center justify-center p-4">
            <p className="text-center text-gray-500">채팅방이 없습니다.</p>
          </div>
        ) : (
          chatRooms.map((chatRoom) => (
            <ChatListItem
              key={chatRoom.roomId}
              chatRoom={chatRoom}
              isSelected={selectedChatRoomId === chatRoom.roomId}
              onClick={() => handleSelectRoom(chatRoom.roomId)}
            />
          ))
        )}
      </div>

      {/* 모달 */}
      {isModalOpen && <UserSelectModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
};
