import { useState } from 'react';
import { ArrowUp, ArrowDown, ChevronsUpDown } from 'lucide-react';

import { Button } from '../../../../shared/components/ui';
import type {
  ArtistListProps,
  ArtistSortIconProps,
  ArtistSortKey,
  SortOrder,
} from '../types/inbound';

const SortIcon = ({ column, sortKey, sortOrder }: ArtistSortIconProps) => {
  if (sortKey !== column)
    return <ChevronsUpDown className="h-3 w-3 shrink-0" />;
  return sortOrder === 'asc' ? (
    <ArrowUp className="h-3 w-3 shrink-0" />
  ) : (
    <ArrowDown className="h-3 w-3 shrink-0" />
  );
};

export const ArtistList = ({
  artists,
  selectedId,
  isLoading,
  onRowClick,
  onInboundAllView,
  onInboundRecentView,
  onConfirmToggle,
}: ArtistListProps) => {
  const [sortKey] = useState<ArtistSortKey>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  const handleSortChange = () => {
    setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
  };

  const sortedArtists = [...artists].sort((a, b) => {
    const comparison = a.name.localeCompare(b.name, 'ko');
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  return (
    <section className="flex flex-col overflow-hidden rounded-xl bg-white px-6 pb-5 pt-4">
      <header className="shrink-0 border-b pb-3">
        <h2 className="font-bold">입고작가 리스트</h2>
      </header>

      <table className="w-full table-fixed text-sm">
        <thead className="block w-full">
          <tr className="table w-full border-b text-center text-gray-500">
            <th className="w-[8%] py-3" scope="col" />
            <th className="w-[18%] py-3" scope="col">
              <button
                type="button"
                className="mx-auto flex items-center gap-1"
                onClick={handleSortChange}
                aria-label="작가명 정렬"
              >
                작가
                <SortIcon
                  column="name"
                  sortKey={sortKey}
                  sortOrder={sortOrder}
                />
              </button>
            </th>
            <th className="w-[15%] py-3" scope="col">
              분류
            </th>
            <th className="w-[18%] py-3" scope="col">
              최근입고일
            </th>
            <th className="w-[13%] py-3" scope="col">
              전체입고
            </th>
            <th className="w-[13%] py-3" scope="col">
              최근입고
            </th>
            <th className="0 w-[15%] py-3 pr-1" scope="col">
              입고확인
            </th>
          </tr>
        </thead>

        <tbody
          className="block overflow-y-auto"
          style={{
            maxHeight: 'calc(100vh - 38rem)',
            scrollbarGutter: 'stable',
          }}
        >
          {isLoading ? (
            <tr className="table w-full">
              <td colSpan={7} className="py-10 text-center text-gray-400">
                불러오는 중...
              </td>
            </tr>
          ) : sortedArtists.length === 0 ? (
            <tr className="table w-full">
              <td colSpan={7} className="py-10 text-center text-gray-400">
                등록된 작가가 없습니다.
              </td>
            </tr>
          ) : (
            sortedArtists.map((artist) => (
              <tr
                key={artist.id}
                className={`table w-full cursor-pointer text-center text-sm transition-colors hover:bg-gray-50 ${
                  selectedId === artist.id ? 'bg-gray-50' : ''
                }`}
                onClick={() => onRowClick(artist)}
              >
                <td className="w-[8%] py-2">
                  {artist.imageUrl ? (
                    <img
                      src={artist.imageUrl}
                      alt={artist.name}
                      className="mx-auto h-9 w-9 rounded-full object-cover"
                    />
                  ) : (
                    <div
                      className="mx-auto h-9 w-9 rounded-full bg-gray-200"
                      aria-hidden="true"
                    />
                  )}
                </td>
                <td className="w-[18%] py-2">
                  <div className="truncate">{artist.name}</div>
                </td>
                <td className="w-[15%] py-2">
                  <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                    {artist.category}
                  </span>
                </td>
                <td className="w-[18%] py-2 text-gray-500">
                  {artist.lastInboundDate}
                </td>
                <td
                  className="w-[13%] py-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Button
                    variant="secondaryDark"
                    className="px-3 py-1.5 text-xs"
                    label="열람"
                    onClick={() => onInboundAllView(artist.id)}
                  />
                </td>
                <td
                  className="w-[13%] py-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Button
                    variant="secondaryDark"
                    className="px-3 py-1.5 text-xs"
                    label="열람"
                    onClick={() => onInboundRecentView(artist.id)}
                  />
                </td>
                <td
                  className="w-[14.3%] py-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    className={`rounded px-3 py-1.5 text-xs font-medium transition-colors ${
                      artist.inboundConfirm === '승인'
                        ? 'bg-blue-500 text-white'
                        : 'border border-gray-300 bg-white text-gray-500 hover:bg-gray-50'
                    }`}
                    onClick={() => onConfirmToggle(artist.id)}
                    aria-label={`${artist.name} 입고 확인 상태: ${artist.inboundConfirm}`}
                  >
                    {artist.inboundConfirm}
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </section>
  );
};
