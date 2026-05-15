import { useState } from 'react';
import { ArrowUp, ArrowDown, ChevronsUpDown } from 'lucide-react';

import type {
  SortOrder,
  TaxInvoiceItem,
  TaxInvoiceListProps,
  TaxInvoiceSortKey,
} from '../types/settlement-management-types';

const STATUS_STYLE: Record<string, string> = {
  COMPLETED: 'text-green-600',
  DELAYED: 'text-red-500',
  PENDING: 'text-blue-600',
};

const SortIcon = ({
  column,
  sortKey,
  sortOrder,
}: {
  column: TaxInvoiceSortKey;
  sortKey: TaxInvoiceSortKey;
  sortOrder: SortOrder;
}) => {
  if (sortKey !== column)
    return <ChevronsUpDown className="h-3 w-3 shrink-0" />;
  return sortOrder === 'asc' ? (
    <ArrowUp className="h-3 w-3 shrink-0" />
  ) : (
    <ArrowDown className="h-3 w-3 shrink-0" />
  );
};

export const TaxInvoiceList = ({
  items,
  isLoading,
  onIssue,
}: TaxInvoiceListProps) => {
  const [sortKey, setSortKey] = useState<TaxInvoiceSortKey>('shopName');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  const handleSortChange = (key: TaxInvoiceSortKey) => {
    if (sortKey === key) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const sortedItems = [...items].sort((a, b) => {
    let comparison = 0;
    if (sortKey === 'shopName') {
      comparison = a.shopName.localeCompare(b.shopName, 'ko');
    } else if (sortKey === 'settlementAmount') {
      comparison = a.settlementAmount - b.settlementAmount;
    } else if (sortKey === 'settlementDate') {
      comparison = a.settlementDate.localeCompare(b.settlementDate);
    } else if (sortKey === 'status') {
      comparison = a.statusLabel.localeCompare(b.statusLabel, 'ko');
    }
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const SortButton = ({
    column,
    label,
  }: {
    column: TaxInvoiceSortKey;
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
    <section className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl bg-white px-6 pb-5 pt-4">
      <header className="shrink-0 border-b pb-3">
        <h2 className="font-bold">세금계산서 요청 목록</h2>
      </header>

      <table className="w-full table-fixed text-sm">
        <thead className="block w-full">
          <tr className="table w-full border-b text-center text-gray-500">
            <th className="w-[25%] py-3" scope="col">
              <SortButton column="shopName" label="매장" />
            </th>
            <th className="w-[20%] py-3" scope="col">
              <SortButton column="settlementAmount" label="정산금액" />
            </th>
            <th className="w-[20%] py-3" scope="col">
              <SortButton column="settlementDate" label="정산날짜" />
            </th>
            <th className="w-[20%] py-3" scope="col">
              <SortButton column="status" label="상태" />
            </th>
            <th className="w-[15%] py-3" scope="col">
              세금계산서 발행
            </th>
          </tr>
        </thead>

        <tbody
          className="block overflow-y-auto"
          style={{
            maxHeight: 'calc(100vh - 45rem)',
            scrollbarGutter: 'stable',
          }}
        >
          {isLoading ? (
            <tr className="table w-full">
              <td colSpan={5} className="py-10 text-center text-gray-400">
                불러오는 중...
              </td>
            </tr>
          ) : sortedItems.length === 0 ? (
            <tr className="table w-full">
              <td colSpan={5} className="py-10 text-center text-gray-400">
                세금계산서 요청 내역이 없습니다.
              </td>
            </tr>
          ) : (
            sortedItems.map((item: TaxInvoiceItem) => (
              <tr
                key={item.id}
                className="table w-full text-center text-sm transition-colors hover:bg-gray-50"
              >
                <td className="w-[25%] py-3">
                  <div className="truncate">{item.shopName}</div>
                </td>
                <td className="w-[20%] py-3 font-medium">
                  {item.settlementAmount.toLocaleString()}원
                </td>
                <td className="w-[20%] py-3 text-gray-500">
                  {item.settlementDate}
                </td>
                <td
                  className={`w-[20%] py-3 font-medium ${STATUS_STYLE[item.status] ?? 'text-gray-500'}`}
                >
                  {item.statusLabel}
                </td>
                <td
                  className="w-[15%] py-3"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    className="rounded-lg bg-gray-900 px-4 py-1.5 text-xs font-medium text-white transition-colors hover:bg-gray-700"
                    onClick={() => onIssue(item.id)}
                  >
                    발행하기
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
