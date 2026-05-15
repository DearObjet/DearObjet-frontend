import { useState, useMemo } from 'react';
import { ArrowUp, ArrowDown, ChevronsUpDown, Search } from 'lucide-react';

import { Button } from '../../../../shared/components/ui';

import type {
  ProductSortIconProps,
  ProductSortKey,
  SettlementProduct,
  SettlementProductListProps,
  SortOrder,
} from '../types/settlement-calculation-types';

const SortIcon = ({ column, sortKey, sortOrder }: ProductSortIconProps) => {
  if (sortKey !== column)
    return <ChevronsUpDown className="h-3 w-3 shrink-0" />;
  return sortOrder === 'asc' ? (
    <ArrowUp className="h-3 w-3 shrink-0" />
  ) : (
    <ArrowDown className="h-3 w-3 shrink-0" />
  );
};

export const SettlementProductList = ({
  products,
  isLoading,
  onSettle,
}: SettlementProductListProps) => {
  const [sortKey, setSortKey] = useState<ProductSortKey>('productName');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');

  const handleSortChange = (key: ProductSortKey) => {
    if (sortKey === key) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products;
    const query = searchQuery.trim().toLowerCase();
    return products.filter(
      (p) =>
        p.productName.toLowerCase().includes(query) ||
        p.artistName.toLowerCase().includes(query)
    );
  }, [products, searchQuery]);

  const sortedProducts = useMemo(() => {
    return [...filteredProducts].sort((a, b) => {
      let comparison = 0;
      if (sortKey === 'productName') {
        comparison = a.productName.localeCompare(b.productName, 'ko');
      } else if (sortKey === 'price') {
        comparison = a.price - b.price;
      } else if (sortKey === 'salesQuantity') {
        comparison = a.salesQuantity - b.salesQuantity;
      } else if (sortKey === 'marginAmount') {
        comparison = a.marginAmount - b.marginAmount;
      } else if (sortKey === 'settlementAmount') {
        comparison = a.settlementAmount - b.settlementAmount;
      } else if (sortKey === 'artistName') {
        comparison = a.artistName.localeCompare(b.artistName, 'ko');
      } else if (sortKey === 'lastInboundDate') {
        comparison = a.lastInboundDate.localeCompare(b.lastInboundDate);
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [filteredProducts, sortKey, sortOrder]);

  const isAllSelected =
    sortedProducts.length > 0 &&
    sortedProducts.every((p) => selectedIds.has(p.contractProductId));

  const handleToggleAll = () => {
    if (isAllSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(sortedProducts.map((p) => p.contractProductId)));
    }
  };

  const handleToggleRow = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const totalSettlementAmount = useMemo(
    () =>
      sortedProducts
        .filter((p) => selectedIds.has(p.contractProductId))
        .reduce((sum, p) => sum + p.settlementAmount, 0),
    [sortedProducts, selectedIds]
  );

  const handleSettle = () => {
    if (selectedIds.size === 0) {
      alert('정산할 품목을 선택해주세요.');
      return;
    }
    onSettle(Array.from(selectedIds));
  };

  const SortButton = ({
    column,
    label,
  }: {
    column: ProductSortKey;
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
    <section className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl bg-white px-6 pb-0 pt-4">
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between border-b pb-3">
        <h2 className="font-bold">
          품목{' '}
          <span className="font-normal text-gray-400">
            ({selectedIds.size}/{products.length})
          </span>
        </h2>
        <div className="flex items-center gap-3">
          <Button
            variant="secondaryDark"
            className="px-4 py-2 text-xs"
            label="엑셀로 내려받기"
            onClick={() => alert('엑셀 내려받기 기능은 준비 중입니다.')}
          />
          <div className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-1.5">
            <Search className="h-3.5 w-3.5 text-gray-400" />
            <input
              type="text"
              className="w-36 text-sm outline-none placeholder:text-gray-400"
              placeholder="검색"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="품목 검색"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <table className="w-full table-fixed text-sm">
        <thead className="block w-full">
          <tr className="table w-full border-b text-center text-gray-500">
            <th className="w-[4%] py-3" scope="col">
              <input
                type="checkbox"
                checked={isAllSelected}
                onChange={handleToggleAll}
                aria-label="전체 선택"
                className="cursor-pointer"
              />
            </th>
            <th className="w-[4%] py-3" scope="col" />
            <th className="w-[22%] py-3 text-left" scope="col">
              <SortButton column="productName" label="상품명" />
            </th>
            <th className="w-[10%] py-3" scope="col">
              <SortButton column="price" label="판매가" />
            </th>
            <th className="w-[9%] py-3" scope="col">
              <SortButton column="salesQuantity" label="판매수량" />
            </th>
            <th className="w-[10%] py-3" scope="col">
              수수료
            </th>
            <th className="w-[11%] py-3" scope="col">
              <SortButton column="marginAmount" label="마진금액" />
            </th>
            <th className="w-[11%] py-3" scope="col">
              <SortButton column="settlementAmount" label="정산금액" />
            </th>
            <th className="w-[10%] py-3" scope="col">
              <SortButton column="artistName" label="작가" />
            </th>
            <th className="w-[9%] py-3" scope="col">
              <SortButton column="lastInboundDate" label="최근입고일" />
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
              <td colSpan={10} className="py-10 text-center text-gray-400">
                불러오는 중...
              </td>
            </tr>
          ) : sortedProducts.length === 0 ? (
            <tr className="table w-full">
              <td colSpan={10} className="py-10 text-center text-gray-400">
                {products.length === 0
                  ? '작가를 선택하면 품목 목록이 표시됩니다.'
                  : '검색 결과가 없습니다.'}
              </td>
            </tr>
          ) : (
            sortedProducts.map((product: SettlementProduct) => {
              const isSelected = selectedIds.has(product.contractProductId);
              return (
                <tr
                  key={product.contractProductId}
                  className={`table w-full cursor-pointer text-center text-sm transition-colors hover:bg-gray-50 ${
                    isSelected ? 'bg-gray-50' : ''
                  }`}
                  onClick={() => handleToggleRow(product.contractProductId)}
                >
                  <td
                    className="w-[4%] py-3"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() =>
                        handleToggleRow(product.contractProductId)
                      }
                      aria-label={`${product.productName} 선택`}
                      className="cursor-pointer"
                    />
                  </td>
                  <td className="w-[4%] py-2">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.productName}
                        className="mx-auto h-9 w-9 rounded object-cover"
                      />
                    ) : (
                      <div
                        className="mx-auto h-9 w-9 rounded bg-gray-200"
                        aria-hidden="true"
                      />
                    )}
                  </td>
                  <td className="w-[22%] py-3 text-left">
                    <div className="truncate pr-2">{product.productName}</div>
                  </td>
                  <td className="w-[10%] py-3 text-gray-700">
                    {product.price.toLocaleString()}원
                  </td>
                  <td className="w-[9%] py-3">{product.salesQuantity}</td>
                  <td className="w-[10%] py-3 text-gray-500">
                    {product.commission}
                  </td>
                  <td className="w-[11%] py-3 text-gray-700">
                    {product.marginAmount.toLocaleString()}원
                  </td>
                  <td className="w-[11%] py-3 font-semibold">
                    <span className="rounded bg-gray-100 px-2 py-0.5">
                      {product.settlementAmount.toLocaleString()}원
                    </span>
                  </td>
                  <td className="w-[10%] py-3 text-gray-500">
                    {product.artistName}
                  </td>
                  <td className="w-[9%] py-3 text-gray-400">
                    {product.lastInboundDate}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>

      {/* Footer */}
      <div className="flex shrink-0 items-center justify-end gap-4 border-t py-4">
        <span className="text-sm font-medium text-gray-500">Total</span>
        <span className="min-w-[100px] rounded-lg bg-gray-100 px-4 py-2 text-right text-sm font-bold">
          {totalSettlementAmount.toLocaleString()}원
        </span>
        <Button
          variant="primary"
          className="px-6 py-2 text-sm"
          label="정산하기"
          disabled={selectedIds.size === 0}
          onClick={handleSettle}
        />
      </div>
    </section>
  );
};
