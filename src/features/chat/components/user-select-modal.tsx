import { useCallback, useState } from 'react';

import { useAppDispatch } from '../../../app/hooks';

import {
  useGetUserListQuery,
  useGetOrCreateDirectChatMutation,
} from '../api/chat-api';
import { selectChatRoom } from '../slices/chat-slice';
import type { UserListProps, UserSelectModalProps } from '../types/chat-types';

// 유저 목록 상태별 렌더링
const UserList = ({
  isLoading,
  userList,
  selectedUserId,
  onSelect,
}: UserListProps) => {
  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-theme-900" />
      </div>
    );
  }

  if (userList.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-theme-500">
        검색 결과가 없습니다.
      </p>
    );
  }

  return (
    <>
      {userList.map((user) => (
        <div
          key={user.userId}
          onClick={() => onSelect(user.userId)}
          className={`grid cursor-pointer grid-cols-3 border-b border-gray-100 py-3 transition-colors hover:bg-gray-50 ${
            selectedUserId === user.userId ? 'bg-gray-100' : ''
          }`}
        >
          <span className="text-sm text-gray-900">{user.name}</span>
          <span className="text-sm text-gray-600">{user.category}</span>
          <span className="text-sm text-gray-600">{user.status}</span>
        </div>
      ))}
    </>
  );
};

export const UserSelectModal = ({ onClose }: UserSelectModalProps) => {
  const dispatch = useAppDispatch();
  const [search, setSearch] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  const { data: userList = [], isLoading } = useGetUserListQuery(search);
  const [getOrCreateDirectChat, { isLoading: isCreating }] =
    useGetOrCreateDirectChatMutation();

  const handleSend = useCallback(async () => {
    if (!selectedUserId) return;
    try {
      const chatRoom = await getOrCreateDirectChat(selectedUserId).unwrap();
      dispatch(selectChatRoom(chatRoom.roomId));
      onClose();
    } catch (e) {
      console.error('채팅방 생성 실패:', e);
    }
  }, [selectedUserId, getOrCreateDirectChat, dispatch, onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="w-[500px] rounded-2xl bg-white p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-6 text-center text-xl font-bold">사용자 계정 검색</h2>

        {/* 검색 바 */}
        <div className="relative mb-4">
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
          <input
            type="text"
            placeholder="검색"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-200 py-2 pl-10 pr-4 text-sm focus:border-gray-400 focus:outline-none"
          />
        </div>

        {/* 테이블 헤더 */}
        <div className="mb-2 grid grid-cols-3 border-b border-gray-200 pb-2">
          <span className="text-sm font-semibold text-gray-900">계정명</span>
          <span className="text-sm font-semibold text-gray-900">
            주요 카테고리
          </span>
          <span className="text-sm font-semibold text-gray-900">상태</span>
        </div>

        {/* 유저 목록 */}
        <div className="mb-6 max-h-80 overflow-y-auto">
          <UserList
            isLoading={isLoading}
            userList={userList}
            selectedUserId={selectedUserId}
            onSelect={setSelectedUserId}
          />
        </div>

        {/* 보내기 버튼 */}
        <button
          onClick={handleSend}
          disabled={!selectedUserId || isCreating}
          className="w-full rounded-lg bg-black py-3 font-medium text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isCreating ? '생성 중...' : '보내기'}
        </button>
      </div>
    </div>
  );
};
