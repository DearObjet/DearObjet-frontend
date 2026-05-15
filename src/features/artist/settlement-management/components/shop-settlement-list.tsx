import { useState } from 'react';
import { ArrowUp, ArrowDown, ChevronsUpDown } from 'lucide-react';

import type {
  ShopSettlement,
  ShopSettlementListProps,
  ShopSortIconProps,
  ShopSortKey,
  SortOrder,
} from '../types/settlement-management-types';

const STATUS_STYLE: Record<string, string> = {
  COMPLETED: 'bg-green-100 text-green-700',
  DELAYED: 'bg-red-100 text-red-600',
  PENDING: 'bg-blue-100 text-blue-700',
};

const getDaysRemainingStyle = (value: string): string => {
  if (value === 'D-0') return 'font-semibold text-red-500';
  if (value.startsWith('D-')) return 'text-orange-500';
  return 'text-gray-400';
};

const SortIcon = ({ column, sortKey, sortOrder }: ShopSortIconProps) => {
  if (sortKey !== column)
    return <ChevronsUpDown className="h-3 w-3 shrink-0" />;
  return sortOrder === 'asc' ? (
    <ArrowUp className="h-3 w-3 shrink-0" />
  ) : (
    <ArrowDown className="h-3 w-3 shrink-0" />
  );
};

export const ShopSettlementList = ({
  shops,
  selectedId,
  isLoading,
  onRowClick,
}: ShopSettlementListProps) => {
  const [sortKey, setSortKey] = useState<ShopSortKey>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  const handleSortChange = (key: ShopSortKey) => {
    if (sortKey === key) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const parseDays = (s: string): number => {
    if (s === 'D-0') return 0;
    if (s.startsWith('D-')) return Number(s.slice(2));
    return -Number(s.slice(2));
  };

  const sortedShops = [...shops].sort((a, b) => {
    let comparison = 0;
    if (sortKey === 'name') {
      comparison = a.shopName.localeCompare(b.shopName, 'ko');
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
    column: ShopSortKey;
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
        <h2 className="font-bold">입점 매장 목록</h2>
      </header>

      <table className="w-full table-fixed text-sm">
        <thead className="block w-full">
          <tr className="table w-full border-b text-center text-gray-500">
            <th className="w-[8%] py-3" scope="col" />
            <th className="w-[22%] py-3" scope="col">
              <SortButton column="name" label="매장" />
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
            <th className="w-[18%] py-3" scope="col">
              <SortButton column="status" label="정산상태" />
            </th>
          </tr>
        </thead>

        <tbody
          className="block overflow-y-auto"
          style={{
            maxHeight: 'calc(100vh - 36rem)',
            scrollbarGutter: 'stable',
          }}
        >
          {isLoading ? (
            <tr className="table w-full">
              <td colSpan={6} className="py-10 text-center text-gray-400">
                불러오는 중...
              </td>
            </tr>
          ) : sortedShops.length === 0 ? (
            <tr className="table w-full">
              <td colSpan={6} className="py-10 text-center text-gray-400">
                입점된 매장이 없습니다.
              </td>
            </tr>
          ) : (
            sortedShops.map((shop: ShopSettlement) => (
              <tr
                key={shop.contractId}
                className={`table w-full cursor-pointer text-center text-sm transition-colors hover:bg-gray-50 ${
                  selectedId === shop.contractId ? 'bg-gray-50' : ''
                }`}
                onClick={() => onRowClick(shop)}
              >
                <td className="w-[8%] py-2">
                  {shop.imageUrl ? (
                    <img
                      src={shop.imageUrl}
                      alt={shop.shopName}
                      className="mx-auto h-9 w-9 rounded-full object-cover"
                    />
                  ) : (
                    <div
                      className="mx-auto h-9 w-9 rounded-full bg-gray-200"
                      aria-hidden="true"
                    />
                  )}
                </td>
                <td className="w-[22%] py-2">
                  <div className="truncate">{shop.shopName}</div>
                </td>
                <td className="w-[18%] py-2">
                  <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                    {shop.category}
                  </span>
                </td>
                <td className="w-[18%] py-2 text-gray-500">
                  {shop.settlementDate}
                </td>
                <td
                  className={`w-[16%] py-2 ${getDaysRemainingStyle(shop.daysRemaining)}`}
                >
                  {shop.daysRemaining}
                </td>
                <td className="w-[18%] py-2">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      STATUS_STYLE[shop.status] ?? 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {shop.statusLabel}
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
