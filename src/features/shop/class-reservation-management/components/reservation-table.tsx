import { useState, type Dispatch, type SetStateAction } from 'react';

import type { Reservation } from '../types/reservation-types';
import Sort from '../../../../assets/sort.svg';
import { Button } from '../../../../shared/components/ui';
import { ReservationTableRow } from './reservation-table-row';

type SortKey = keyof Omit<Reservation, 'status'>;
type SortOrder = 'asc' | 'desc';

const COL_WIDTHS = [
  '2.78125rem',
  '5.125rem',
  '8.6875rem',
  '7.9063rem',
  '11.9375rem',
  '9rem',
  '13.5625rem',
  'auto',
];

interface ReservationTableProps {
  data: Reservation[];
  selectedIds: Set<number>;
  onSelectedIdsChange: Dispatch<SetStateAction<Set<number>>>;
}

export const ReservationTable = ({
  data,
  selectedIds,
  onSelectedIdsChange,
}: ReservationTableProps) => {
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const isAllSelected = data.length > 0 && selectedIds.size === data.length;

  const handleSelectAll = () => {
    if (isAllSelected) {
      onSelectedIdsChange(new Set());
    } else {
      onSelectedIdsChange(new Set(data.map((item) => item.reservationId)));
    }
  };

  const handleSelectOne = (id: number) => {
    onSelectedIdsChange((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const sortedData = [...data].sort((a, b) => {
    if (!sortKey) return 0;
    const aVal = a[sortKey];
    const bVal = b[sortKey];

    if (sortKey === 'usageDateTime') {
      return sortOrder === 'asc'
        ? new Date(aVal as string).getTime() -
            new Date(bVal as string).getTime()
        : new Date(bVal as string).getTime() -
            new Date(aVal as string).getTime();
    }

    if (sortKey === 'reservationId') {
      return sortOrder === 'asc'
        ? (aVal as number) - (bVal as number)
        : (bVal as number) - (aVal as number);
    }

    if (sortKey === 'phoneNumber') {
      const aNum = Number((aVal as string).replace(/[^0-9]/g, ''));
      const bNum = Number((bVal as string).replace(/[^0-9]/g, ''));
      return sortOrder === 'asc' ? aNum - bNum : bNum - aNum;
    }

    return sortOrder === 'asc'
      ? (aVal as string).localeCompare(bVal as string, 'ko', { numeric: true })
      : (bVal as string).localeCompare(aVal as string, 'ko', { numeric: true });
  });

  const SortButton = ({ sortTarget }: { sortTarget: SortKey }) => (
    <Button
      variant="icon"
      onClick={() => handleSort(sortTarget)}
      icon={
        <img
          src={Sort}
          alt="정렬"
          className={`inline-block ${sortKey === sortTarget && sortOrder === 'desc' ? 'rotate-180' : ''}`}
        />
      }
    />
  );

  const Colgroup = () => (
    <colgroup>
      {COL_WIDTHS.map((w, i) => (
        <col key={i} style={{ width: w }} />
      ))}
    </colgroup>
  );

  return (
    <div className="w-full">
      <table className="w-full table-fixed">
        <Colgroup />
        <thead>
          <tr className="text-gray-9 border-b border-t text-sm">
            <th className="py-3 text-left font-medium">
              <input
                type="checkbox"
                checked={isAllSelected}
                onChange={handleSelectAll}
              />
            </th>
            <th className="py-3 text-left font-medium">상태</th>
            <th className="py-3 text-left font-medium">
              예약자명 <SortButton sortTarget="reserverName" />
            </th>
            <th className="py-3 text-left font-medium">
              전화번호 <SortButton sortTarget="phoneNumber" />
            </th>
            <th className="py-3 text-left font-medium">
              예약번호 <SortButton sortTarget="reservationId" />
            </th>
            <th className="py-3 text-left font-medium">
              이용일시 <SortButton sortTarget="usageDateTime" />
            </th>
            <th className="py-3 text-left font-medium">
              클래스명 <SortButton sortTarget="className" />
            </th>
            <th className="py-3 text-left font-medium">인원</th>
          </tr>
        </thead>
      </table>
      <div
        className="max-h-[calc(7*3.25rem)] overflow-y-auto"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: '#000000 transparent',
        }}
      >
        <table className="w-full table-fixed">
          <Colgroup />
          <tbody>
            {sortedData.map((item) => (
              <ReservationTableRow
                key={item.reservationId}
                data={item}
                checked={selectedIds.has(item.reservationId)}
                onCheck={handleSelectOne}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
