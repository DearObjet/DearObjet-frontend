import { useCallback, useState } from 'react';

import { useAppSelector } from '../../../app/hooks';
import { useSearchArtistsQuery } from '../../../features/contract-management/api/contract-management-api';
import type { ArtistSearchItem } from '../../../features/contract-management/types/contract-management-types';

export interface ArtistSelectModalProps {
  onClose: () => void;
  onSelectArtist: (artist: ArtistSearchItem) => void;
}

export const UserSelectModal = ({
  onClose,
  onSelectArtist,
}: ArtistSelectModalProps) => {
  const userId = useAppSelector((state) => state.auth.user?.userId);
  const [search, setSearch] = useState('');
  const [selectedArtistId, setSelectedArtistId] = useState<number | null>(null);

  const { data: artistData, isLoading } = useSearchArtistsQuery(
    { userId: userId!, keyword: search },
    { skip: !userId || search.length < 1 }
  );
  console.log(artistData, isLoading);
  const artistList = artistData?.items ?? [];

  const handleSelect = useCallback(() => {
    if (!selectedArtistId) return;
    const artist = artistList.find((a) => a.artistId === selectedArtistId);
    if (artist) {
      onSelectArtist(artist);
      onClose();
    }
  }, [selectedArtistId, artistList, onSelectArtist, onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="w-[500px] rounded-2xl bg-white p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-6 text-center text-xl font-bold">작가 검색</h2>

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
          <span className="text-sm font-semibold text-gray-900">작가명</span>
          <span className="text-sm font-semibold text-gray-900">전문분야</span>
          <span className="text-sm font-semibold text-gray-900">이메일</span>
        </div>

        <div className="mb-6 max-h-80 overflow-y-auto">
          {isLoading ? (
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
          onClick={handleSelect}
          disabled={!selectedArtistId}
          className="w-full rounded-lg bg-black py-3 font-medium text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          선택
        </button>
      </div>
    </div>
  );
};
