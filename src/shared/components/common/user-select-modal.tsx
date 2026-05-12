import { useCallback, useState } from 'react';

import { useAppDispatch, useAppSelector } from '../../../app/hooks';

import {
  useGetUserListQuery,
  useGetOrCreateDirectChatMutation,
} from '../../../features/chat/api/chat-api';
import { selectChatRoom } from '../../../features/chat/slices/chat-slice';
import { useSearchArtistsQuery } from '../../../features/contract-management/api/contract-management-api';
import type { ArtistSearchItem } from '../../../features/contract-management/types/contract-management-types';
import type {
  UserListProps,
  UserSelectModalProps,
} from '../../../features/chat/types/chat-types';

type Mode = 'chat' | 'contract';

interface ExtendedUserSelectModalProps extends UserSelectModalProps {
  mode?: Mode;
  onSelectArtist?: (artist: ArtistSearchItem) => void;
}

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

export const UserSelectModal = ({
  onClose,
  mode = 'chat',
  onSelectArtist,
}: ExtendedUserSelectModalProps) => {
  const dispatch = useAppDispatch();
  const userId = useAppSelector((state) => state.auth.user?.userId);
  const [search, setSearch] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [selectedArtistId, setSelectedArtistId] = useState<number | null>(null);

  const { data: userList = [], isLoading: isChatLoading } = useGetUserListQuery(
    search,
    { skip: mode !== 'chat' }
  );

  const { data: artistData, isLoading: isArtistLoading } =
    useSearchArtistsQuery(
      { userId: userId!, keyword: search },
      { skip: mode !== 'contract' || !userId || search.length < 1 }
    );

  const artistList = artistData?.items ?? [];
  const isLoading = mode === 'chat' ? isChatLoading : isArtistLoading;

  const [getOrCreateDirectChat, { isLoading: isCreating }] =
    useGetOrCreateDirectChatMutation();

  const handleSend = useCallback(async () => {
    if (mode === 'chat') {
      if (!selectedUserId) return;
      try {
        const chatRoom = await getOrCreateDirectChat(selectedUserId).unwrap();
        dispatch(selectChatRoom(chatRoom.roomId));
        onClose();
      } catch (e) {
        console.error('채팅방 생성 실패:', e);
      }
    } else {
      if (!selectedArtistId) return;
      const artist = artistList.find((a) => a.artistId === selectedArtistId);
      if (artist && onSelectArtist) {
        onSelectArtist(artist);
        onClose();
      }
    }
  }, [
    mode,
    selectedUserId,
    selectedArtistId,
    artistList,
    getOrCreateDirectChat,
    dispatch,
    onClose,
    onSelectArtist,
  ]);

  const isDisabled = mode === 'chat' ? !selectedUserId : !selectedArtistId;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="w-[500px] rounded-2xl bg-white p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-6 text-center text-xl font-bold">
          {mode === 'chat' ? '사용자 계정 검색' : '작가 검색'}
        </h2>

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

        <div className="grid grid-cols-3 border-b border-gray-200 pb-4 text-center">
          <span className="text-sm font-semibold text-gray-900">
            {mode === 'chat' ? '계정명' : '작가명'}
          </span>
          <span className="text-sm font-semibold text-gray-900">
            {mode === 'chat' ? '주요 카테고리' : '전문분야'}
          </span>
          <span className="text-sm font-semibold text-gray-900">
            {mode === 'chat' ? '상태' : '이메일'}
          </span>
        </div>

        <div className="mb-6 max-h-80 overflow-y-auto">
          {mode === 'chat' ? (
            <UserList
              isLoading={isLoading}
              userList={userList}
              selectedUserId={selectedUserId}
              onSelect={setSelectedUserId}
            />
          ) : isLoading ? (
            <div className="flex justify-center py-8">
              <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-theme-900" />
            </div>
          ) : artistList.length === 0 ? (
            <p className="py-8 text-center text-sm text-theme-500">
              {search.length < 1
                ? '작가 이름을 검색해주세요.'
                : '검색 결과가 없습니다.'}
            </p>
          ) : (
            artistList.map((artist) => (
              <div
                key={artist.artistId}
                onClick={() => setSelectedArtistId(artist.artistId)}
                className={`grid cursor-pointer grid-cols-3 border-b border-gray-100 py-3 transition-colors hover:bg-gray-50 ${
                  selectedArtistId === artist.artistId ? 'bg-gray-100' : ''
                }`}
              >
                <span className="text-sm text-gray-900">
                  {artist.artistName}
                </span>
                <span className="text-sm text-gray-600">
                  {artist.specialty}
                </span>
                <span className="text-sm text-gray-600">{artist.email}</span>
              </div>
            ))
          )}
        </div>

        <button
          onClick={handleSend}
          disabled={isDisabled || isCreating}
          className="w-full rounded-lg bg-black py-3 font-medium text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isCreating ? '생성 중...' : mode === 'chat' ? '보내기' : '선택'}
        </button>
      </div>
    </div>
  );
};
