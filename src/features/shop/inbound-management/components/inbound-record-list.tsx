import { useState, useMemo, useEffect, type ChangeEvent } from 'react';
import { ArrowUp, ArrowDown, ChevronsUpDown, Search } from 'lucide-react';
import * as XLSX from 'xlsx';

import { Button } from '../../../../shared/components/ui';

import type {
  InboundRecord,
  InboundRecordListProps,
  RecordSortKey,
  RecordSortIconProps,
  SortOrder,
} from '../types/inbound';

const SortIcon = ({ column, sortKey, sortOrder }: RecordSortIconProps) => {
  if (sortKey !== column)
    return <ChevronsUpDown className="h-3 w-3 shrink-0" />;
  return sortOrder === 'asc' ? (
    <ArrowUp className="h-3 w-3 shrink-0" />
  ) : (
    <ArrowDown className="h-3 w-3 shrink-0" />
  );
};

export const InboundRecordList = ({
  records,
  isLoading,
  isRecentMode,
  onStockSave,
}: InboundRecordListProps) => {
  const [checkedIds, setCheckedIds] = useState<Set<number>>(new Set());
  const [pendingStocks, setPendingStocks] = useState<Record<number, number>>(
    {}
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [sortKey, setSortKey] = useState<RecordSortKey>('lastInboundDate');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [isSaving, setIsSaving] = useState(false);

  const handleSortChange = (key: RecordSortKey) => {
    if (sortKey === key) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const filteredRecords = useMemo(() => {
    if (!searchQuery.trim()) return records;
    const q = searchQuery.toLowerCase();
    return records.filter(
      (r) =>
        r.productName.toLowerCase().includes(q) ||
        r.artistName.toLowerCase().includes(q)
    );
  }, [records, searchQuery]);

  const sortedRecords = useMemo(() => {
    const comparators: Record<
      RecordSortKey,
      (a: InboundRecord, b: InboundRecord) => number
    > = {
      productName: (a, b) => a.productName.localeCompare(b.productName, 'ko'),
      price: (a, b) => a.price - b.price,
      stock: (a, b) => a.stock - b.stock,
      commission: (a, b) => a.commissionRate - b.commissionRate,
      marginAmount: (a, b) => a.marginAmount - b.marginAmount,
      settlementPerUnit: (a, b) => a.settlementPerUnit - b.settlementPerUnit,
      artistName: (a, b) => a.artistName.localeCompare(b.artistName, 'ko'),
      lastInboundDate: (a, b) =>
        a.lastInboundDate.localeCompare(b.lastInboundDate),
    };

    return [...filteredRecords].sort((a, b) => {
      const comparison = comparators[sortKey](a, b);
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [filteredRecords, sortKey, sortOrder]);

  const isAllChecked =
    sortedRecords.length > 0 &&
    sortedRecords.every((r) => checkedIds.has(r.id));

  const handleCheckAll = (checked: boolean) => {
    setCheckedIds(
      checked ? new Set(sortedRecords.map((r) => r.id)) : new Set()
    );
  };

  const handleCheck = (id: number, checked: boolean) => {
    setCheckedIds((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const getStock = (record: InboundRecord) =>
    pendingStocks[record.id] ?? record.stock;

  const handleStockChange = (id: number, value: number) => {
    setPendingStocks((prev) => ({ ...prev, [id]: Math.max(0, value) }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onStockSave(pendingStocks);
      setPendingStocks({});
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setPendingStocks({});
  };

  const handleExcelDownload = () => {
    const selectedRecords = sortedRecords.filter((r) => checkedIds.has(r.id));

    if (selectedRecords.length === 0) {
      alert('다운로드할 항목을 선택해주세요.');
      return;
    }

    const excelData = selectedRecords.map((record) => ({
      상품명: record.productName,
      판매가: record.price,
      재고: record.stock,
      수수료: record.commission,
      마진금액: record.marginAmount,
      '개당 정산금액': record.settlementPerUnit,
      작가: record.artistName,
      최근입고일: record.lastInboundDate,
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);

    worksheet['!cols'] = [
      { wch: 30 }, // 상품명
      { wch: 12 }, // 판매가
      { wch: 8 }, // 재고
      { wch: 8 }, // 수수료
      { wch: 12 }, // 마진금액
      { wch: 15 }, // 개당 정산금액
      { wch: 15 }, // 작가
      { wch: 12 }, // 최근입고일
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, '전체입고');

    const today = new Date().toISOString().slice(0, 10);
    XLSX.writeFile(workbook, `전체입고_${today}.xlsx`);
  };

  const colSpanCount = 10;

  useEffect(() => {
    setPendingStocks({});
  }, [records]);

  return (
    <section className="flex flex-1 flex-col overflow-hidden rounded-xl bg-white px-6 pb-5 pt-4">
      <header className="flex shrink-0 items-center justify-between border-b pb-3">
        <h2 className="font-bold">
          {isRecentMode ? '최근입고 리스트' : '전체입고'}
          {records.length > 0 && (
            <span className="ml-1 font-normal text-blue-500">
              {records.length}
            </span>
          )}
        </h2>
        <div className="flex items-center gap-2">
          <Button
            variant="secondaryDark"
            className="shrink-0 px-4 py-2 text-xs"
            label="엑셀로 내려받기"
            onClick={handleExcelDownload}
          />

          <div className="relative flex items-center">
            <Search
              className="absolute left-2.5 h-3.5 w-3.5 text-gray-400"
              aria-hidden="true"
            />
            <input
              type="text"
              className="w-52 rounded-md border border-gray-300 py-2 pl-8 pr-3 text-xs outline-none focus:ring-1 focus:ring-gray-400"
              placeholder="상품명 검색"
              value={searchQuery}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setSearchQuery(e.target.value)
              }
              aria-label="상품명 검색"
            />
          </div>
        </div>
      </header>

      <table className="w-full table-fixed text-sm">
        <thead className="block w-full">
          <tr className="table w-full border-b text-center text-gray-500">
            <th className="w-[4%] py-3" scope="col">
              <div className="flex items-center justify-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 cursor-pointer appearance-none rounded border border-gray-300 checked:bg-gray-900 disabled:cursor-not-allowed disabled:opacity-40"
                  checked={isAllChecked}
                  onChange={(e) => handleCheckAll(e.target.checked)}
                  disabled={sortedRecords.length === 0}
                  aria-label="전체 선택"
                />
              </div>
            </th>

            <th className="w-[6%] py-3" scope="col" />
            <th className="w-[20%] py-3" scope="col">
              <button
                type="button"
                className="mx-auto flex items-center gap-1"
                onClick={() => handleSortChange('productName')}
                aria-label="상품명 정렬"
              >
                상품명
                <SortIcon
                  column="productName"
                  sortKey={sortKey}
                  sortOrder={sortOrder}
                />
              </button>
            </th>
            <th className="w-[10%] py-3" scope="col">
              <button
                type="button"
                className="mx-auto flex items-center gap-1"
                onClick={() => handleSortChange('price')}
                aria-label="판매가 정렬"
              >
                판매가
                <SortIcon
                  column="price"
                  sortKey={sortKey}
                  sortOrder={sortOrder}
                />
              </button>
            </th>
            <th className="w-[9%] py-3" scope="col">
              <button
                type="button"
                className="mx-auto flex items-center gap-1"
                onClick={() => handleSortChange('stock')}
                aria-label="재고 정렬"
              >
                재고
                <SortIcon
                  column="stock"
                  sortKey={sortKey}
                  sortOrder={sortOrder}
                />
              </button>
            </th>

            <th className="w-[9%] py-3" scope="col">
              <button
                type="button"
                className="mx-auto flex items-center gap-1"
                onClick={() => handleSortChange('commission')}
                aria-label="수수료 정렬"
              >
                수수료
                <SortIcon
                  column="commission"
                  sortKey={sortKey}
                  sortOrder={sortOrder}
                />
              </button>
            </th>
            <th className="w-[11%] py-3" scope="col">
              <button
                type="button"
                className="mx-auto flex items-center gap-1"
                onClick={() => handleSortChange('marginAmount')}
                aria-label="마진금액 정렬"
              >
                마진금액
                <SortIcon
                  column="marginAmount"
                  sortKey={sortKey}
                  sortOrder={sortOrder}
                />
              </button>
            </th>
            <th className="w-[13%] py-3" scope="col">
              <button
                type="button"
                className="mx-auto flex items-center gap-1"
                onClick={() => handleSortChange('settlementPerUnit')}
                aria-label="개당 정산금액 정렬"
              >
                개당 정산금액
                <SortIcon
                  column="settlementPerUnit"
                  sortKey={sortKey}
                  sortOrder={sortOrder}
                />
              </button>
            </th>
            <th className="w-[9%] py-3" scope="col">
              <button
                type="button"
                className="mx-auto flex items-center gap-1"
                onClick={() => handleSortChange('artistName')}
                aria-label="작가 정렬"
              >
                작가
                <SortIcon
                  column="artistName"
                  sortKey={sortKey}
                  sortOrder={sortOrder}
                />
              </button>
            </th>
            <th className="w-[9%] py-3 pr-2" scope="col">
              <button
                type="button"
                className="mx-auto flex items-center gap-1"
                onClick={() => handleSortChange('lastInboundDate')}
                aria-label="최근입고일 정렬"
              >
                최근입고일
                <SortIcon
                  column="lastInboundDate"
                  sortKey={sortKey}
                  sortOrder={sortOrder}
                />
              </button>
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
              <td
                colSpan={colSpanCount}
                className="py-10 text-center text-gray-400"
              >
                불러오는 중...
              </td>
            </tr>
          ) : records.length === 0 ? (
            <tr className="table w-full">
              <td
                colSpan={colSpanCount}
                className="py-10 text-center text-gray-400"
              >
                {isRecentMode
                  ? '최근 입고 내역이 없습니다.'
                  : '작가의 열람 버튼을 눌러 입고 내역을 확인하세요.'}
              </td>
            </tr>
          ) : sortedRecords.length === 0 ? (
            <tr className="table w-full">
              <td
                colSpan={colSpanCount}
                className="py-10 text-center text-gray-400"
              >
                검색 결과가 없습니다.
              </td>
            </tr>
          ) : (
            sortedRecords.map((record) => (
              <tr
                key={record.id}
                className={`table w-full text-center transition-colors hover:bg-gray-50 ${
                  !isRecentMode && checkedIds.has(record.id) ? 'bg-gray-50' : ''
                }`}
              >
                <td className="w-[4%] py-2">
                  <div className="flex items-center justify-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 cursor-pointer appearance-none rounded border border-gray-300 checked:bg-gray-900"
                      checked={checkedIds.has(record.id)}
                      onChange={(e) => handleCheck(record.id, e.target.checked)}
                      aria-label={`${record.productName} 선택`}
                    />
                  </div>
                </td>

                <td className="w-[6%] px-2 py-2">
                  {record.imageUrl ? (
                    <img
                      src={record.imageUrl}
                      alt={record.productName}
                      className="mx-auto h-9 w-9 rounded object-cover"
                    />
                  ) : (
                    <div
                      className="mx-auto h-9 w-9 rounded bg-gray-200"
                      aria-hidden="true"
                    />
                  )}
                </td>
                <td className="w-[20%] py-2 pl-2 text-left">
                  <div className="truncate">{record.productName}</div>
                </td>
                <td className="w-[10%] py-2">
                  {record.price.toLocaleString()}원
                </td>
                {!isRecentMode ? (
                  <td className="w-[9%] py-2">
                    <input
                      type="number"
                      min={0}
                      className="w-14 rounded border border-gray-300 py-1 text-center text-sm"
                      value={getStock(record)}
                      onChange={(e) =>
                        handleStockChange(record.id, Number(e.target.value))
                      }
                      aria-label={`${record.productName} 재고 수량`}
                    />
                  </td>
                ) : (
                  <td className="w-[9%] py-2">{record.stock}</td>
                )}
                <td className="w-[9%] py-2">{record.commission}</td>
                <td className="w-[11%] py-2">
                  {record.marginAmount.toLocaleString()}원
                </td>
                <td className="w-[13%] py-2">
                  {record.settlementPerUnit.toLocaleString()}원
                </td>
                <td className="w-[9%] py-2">{record.artistName}</td>
                <td className="w-[8.5%] py-2 text-gray-500">
                  {record.lastInboundDate}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {!isRecentMode && (
        <footer className="flex shrink-0 justify-end gap-1.5 border-t pt-3">
          <Button
            variant="secondaryLight"
            className="px-5 py-2 text-xs"
            label="되돌리기"
            disabled={isSaving}
            onClick={handleReset}
          />
          <Button
            variant="secondaryDark"
            className="px-5 py-2 text-xs"
            label={isSaving ? '저장 중...' : '저장하기'}
            disabled={isSaving}
            onClick={handleSave}
          />
        </footer>
      )}
    </section>
  );
};
