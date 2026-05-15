import { useState } from 'react';
import { ArrowUp, ArrowDown, ChevronsUpDown } from 'lucide-react';

import type {
  ArtistSettlementListProps,
  ArtistSortIconProps,
  ArtistSortKey,
  SettlementArtist,
  SortOrder,
} from '../types/settlement-calculation-types';

const SETTLEMENT_STATUS_STYLE: Record<string, string> = {
  PENDING: 'bg-blue-100 text-blue-700',
  PAID: 'bg-green-100 text-green-700',
  UNPAID: 'bg-gray-100 text-gray-500',
};

const getDaysRemainingStyle = (value: string): string => {
  if (value === 'D-Day') return 'font-semibold text-red-500';
  if (value.startsWith('D-')) return 'text-orange-500';
  return 'text-gray-400';
};

const SortIcon = ({ column, sortKey, sortOrder }: ArtistSortIconProps) => {
  if (sortKey !== column)
    return <ChevronsUpDown className="h-3 w-3 shrink-0" />;
  return sortOrder === 'asc' ? (
    <ArrowUp className="h-3 w-3 shrink-0" />
  ) : (
    <ArrowDown className="h-3 w-3 shrink-0" />
  );
};

export const ArtistSettlementList = ({
  artists,
  selectedId,
  isLoading,
  onRowClick,
}: ArtistSettlementListProps) => {
  const [sortKey, setSortKey] = useState<ArtistSortKey>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  const handleSortChange = (key: ArtistSortKey) => {
    if (sortKey === key) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const parseDays = (s: string): number => {
    if (s === 'D-Day') return 0;
    if (s.startsWith('D-')) return Number(s.slice(2));
    return -Number(s.slice(2));
  };

  const sortedArtists = [...artists].sort((a, b) => {
    let comparison = 0;
    if (sortKey === 'name') {
      comparison = a.name.localeCompare(b.name, 'ko');
    } else if (sortKey === 'daysRemaining') {
      comparison = parseDays(a.daysRemaining) - parseDays(b.daysRemaining);
    } else if (sortKey === 'status') {
      comparison = a.statusLabel.localeCompare(b.statusLabel, 'ko');
    }
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const SortButton = ({
    column,
    label,
  }: {
    column: ArtistSortKey;
    label: string;
  }) => (
    <button
      type="button"
      className="mx-auto flex items-center gap-1"
      onClick={() => handleSortChange(column)}
      aria-label={`${label} 정렬`}
    >
      {label}
      <SortIcon column={column} sortKey={sortKey} sortOrder={sortOrder} />
    </button>
  );

  return (
    <section className="flex flex-col overflow-hidden rounded-xl bg-white px-6 pb-5 pt-4">
      <header className="shrink-0 border-b pb-3">
        <h2 className="font-bold">입점 작가 목록</h2>
      </header>

      <table className="w-full table-fixed text-sm">
        <thead className="block w-full">
          <tr className="table w-full border-b text-center text-gray-500">
            <th className="w-[8%] py-3" scope="col" />
            <th className="w-[20%] py-3" scope="col">
              <SortButton column="name" label="작가" />
            </th>
            <th className="w-[18%] py-3" scope="col">
              분류
            </th>
            <th className="w-[18%] py-3" scope="col">
              정산날짜
            </th>
            <th className="w-[16%] py-3" scope="col">
              <SortButton column="daysRemaining" label="남은날짜" />
            </th>
            <th className="w-[20%] py-3" scope="col">
              <SortButton column="status" label="정산상태" />
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
              <td colSpan={6} className="py-10 text-center text-gray-400">
                불러오는 중...
              </td>
            </tr>
          ) : sortedArtists.length === 0 ? (
            <tr className="table w-full">
              <td colSpan={6} className="py-10 text-center text-gray-400">
                등록된 작가가 없습니다.
              </td>
            </tr>
          ) : (
            sortedArtists.map((artist: SettlementArtist) => (
              <tr
                key={artist.contractId}
                className={`table w-full cursor-pointer text-center text-sm transition-colors hover:bg-gray-50 ${
                  selectedId === artist.contractId ? 'bg-gray-50' : ''
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
                <td className="w-[20%] py-2">
                  <div className="truncate">{artist.name}</div>
                </td>
                <td className="w-[18%] py-2">
                  <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                    {artist.category}
                  </span>
                </td>
                <td className="w-[18%] py-2 text-gray-500">
                  {artist.settlementDate}
                </td>
                <td
                  className={`w-[16%] py-2 ${getDaysRemainingStyle(artist.daysRemaining)}`}
                >
                  {artist.daysRemaining}
                </td>
                <td className="w-[20%] py-2">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      SETTLEMENT_STATUS_STYLE[artist.status] ??
                      'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {artist.statusLabel}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </section>
  );
};
