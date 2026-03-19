import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../store';
import { useGetChatRoomsQuery } from '../../store/api/chatApi';
import { setChatRooms, selectChatRoom } from '../../store/slices/chat-slice';
import ChatListItem from './chat-list-item';

const ChatList: React.FC = () => {
  const dispatch = useDispatch();
  const { selectedChatRoomId, chatRooms } = useSelector(
    (state: RootState) => state.chat
  );

  // 초기 로드용
  const { data, isLoading, error } = useGetChatRoomsQuery();

  useEffect(() => {
    if (data) {
      dispatch(setChatRooms(data));
    }
  }, [data, dispatch]);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center p-4">
        <p className="text-center text-red-500">
          채팅방 목록을 불러오는데 실패했습니다.
        </p>
      </div>
    );
  }

  if (!chatRooms || chatRooms.length === 0) {
    return (
      <div className="flex h-full items-center justify-center p-4">
        <p className="text-center text-gray-500">채팅방이 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-white">
      <div className="border-b border-gray-200 p-4">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">Contacts</h2>
          <span className="text-sm text-gray-500">{chatRooms.length}</span>
        </div>
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
      <div className="flex-1 overflow-y-auto">
        {chatRooms.map((chatRoom) => (
          <ChatListItem
            key={chatRoom.roomId}
            chatRoom={chatRoom}
            isSelected={selectedChatRoomId === chatRoom.roomId}
            onClick={() => dispatch(selectChatRoom(chatRoom.roomId))}
          />
        ))}
      </div>
    </div>
  );
};

export default ChatList;
