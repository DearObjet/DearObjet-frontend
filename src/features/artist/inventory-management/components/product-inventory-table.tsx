import { useState } from 'react';
import { ArrowUp, ArrowDown, ChevronsUpDown } from 'lucide-react';

import { Button } from '../../../../shared/components/ui';

import type {
  ArtistProduct,
  ProductInventoryTableProps,
  SortKey,
  SortOrder,
  SortIconProps,
} from '../types/inventory';

const SortIcon = ({ column, sortKey, sortOrder }: SortIconProps) => {
  if (sortKey !== column)
    return <ChevronsUpDown className="h-3 w-3 shrink-0" />;
  return sortOrder === 'asc' ? (
    <ArrowUp className="h-3 w-3 shrink-0" />
  ) : (
    <ArrowDown className="h-3 w-3 shrink-0" />
  );
};

export const ProductInventoryTable = ({
  products,
  selectedId,
  onRowClick,
  onStockSave,
  onDelete,
}: ProductInventoryTableProps) => {
  const [checkedIds, setCheckedIds] = useState<Set<number>>(new Set());
  const [pendingStocks, setPendingStocks] = useState<Record<number, number>>(
    {}
  );
  const [sortKey, setSortKey] = useState<SortKey>('registeredAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const handleSortChange = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const sortedProducts = [...products].sort((a, b) => {
    let comparison = 0;
    if (sortKey === 'productName')
      comparison = a.productName.localeCompare(b.productName);
    else if (sortKey === 'price') comparison = a.price - b.price;
    else if (sortKey === 'stockQuantity')
      comparison = a.stockQuantity - b.stockQuantity;
    else if (sortKey === 'registeredAt')
      comparison = a.registeredAt.localeCompare(b.registeredAt);
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const isAllChecked =
    products.length > 0 && checkedIds.size === products.length;

  const handleCheckAll = (checked: boolean) => {
    setCheckedIds(
      checked ? new Set(products.map((p) => p.productId)) : new Set()
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

  const getDisplayStock = (product: ArtistProduct) =>
    pendingStocks[product.productId] ?? product.stockQuantity;

  const handleStockChange = (id: number, value: number) => {
    if (value > 200) {
      alert('재고 수량은 최대 200개까지 설정 가능합니다.');
      return;
    }
    setPendingStocks((prev) => ({ ...prev, [id]: Math.max(0, value) }));
  };

  const handleSave = () => {
    if (Object.keys(pendingStocks).length === 0) {
      alert('변경된 재고가 없습니다.');
      return;
    }
    const items = Object.entries(pendingStocks).map(([id, stockQuantity]) => {
      const productId = Number(id);
      const product = products.find((p) => p.productId === productId);
      return {
        productId,
        stockQuantity,
        version: product!.version,
      };
    });

    onStockSave(items);
    setPendingStocks({});
  };

  const handleDelete = () => {
    const ids = Array.from(checkedIds);
    if (ids.length === 0) {
      alert('삭제할 항목을 선택해주세요.');
      return;
    }
    if (window.confirm(`선택한 ${ids.length}개의 상품을 삭제하시겠습니까?`)) {
      onDelete(ids);
      setCheckedIds(new Set());
    }
  };

  const formatDate = (isoString: string) =>
    isoString.slice(0, 10).replace(/-/g, '.');

  return (
    <section className="flex flex-col overflow-hidden rounded-xl bg-white px-6 pb-5 pt-4">
      <div className="flex shrink-0 items-center justify-between border-b pb-3">
        <h2 className="font-bold">품목 및 재고</h2>
        <div className="flex gap-1.5">
          <Button
            variant="secondaryDark"
            className="flex items-center justify-center px-5 py-2 text-xs"
            label="저장"
            onClick={handleSave}
          />
          <Button
            variant="secondaryDark"
            className="flex items-center justify-center px-5 py-2 text-xs"
            label="삭제"
            onClick={handleDelete}
          />
        </div>
      </div>

      <table className="w-full text-sm">
        <thead className="block w-full">
          <tr className="table w-full border-b text-gray-600">
            <th className="w-[5%] py-3" scope="col">
              <div className="flex items-center justify-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 cursor-pointer appearance-none rounded-md border border-gray-300 checked:bg-gray-900"
                  checked={isAllChecked}
                  onChange={(e) => handleCheckAll(e.target.checked)}
                  aria-label="전체 선택"
                />
              </div>
            </th>
            <th className="w-[8%] px-3 py-3" scope="col" />
            <th className="w-[37%] py-3" scope="col">
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
            <th className="w-[15%] py-3" scope="col">
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
            <th className="w-[15%] py-3" scope="col">
              <button
                type="button"
                className="mx-auto flex items-center gap-1"
                onClick={() => handleSortChange('stockQuantity')}
                aria-label="재고 정렬"
              >
                재고
                <SortIcon
                  column="stockQuantity"
                  sortKey={sortKey}
                  sortOrder={sortOrder}
                />
              </button>
            </th>
            <th className="w-[20%] py-3" scope="col">
              <button
                type="button"
                className="mx-auto flex items-center gap-1"
                onClick={() => handleSortChange('registeredAt')}
                aria-label="등록일 정렬"
              >
                등록일
                <SortIcon
                  column="registeredAt"
                  sortKey={sortKey}
                  sortOrder={sortOrder}
                />
              </button>
            </th>
          </tr>
        </thead>

        <tbody
          className="block overflow-y-auto"
          style={{ maxHeight: 'calc(100vh - 9rem)' }}
        >
          {sortedProducts.length === 0 && (
            <tr className="table w-full">
              <td
                colSpan={6}
                className="py-10 text-center text-sm text-gray-400"
              >
                등록된 상품이 없습니다.
              </td>
            </tr>
          )}
          {sortedProducts.map((product) => (
            <tr
              key={product.productId}
              className={`table w-full cursor-pointer text-center transition-colors hover:bg-gray-100 ${
                selectedId === product.productId ? 'bg-gray-100' : ''
              }`}
              onClick={() => onRowClick(product)}
            >
              <td className="w-[5%] py-3" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 cursor-pointer appearance-none rounded-md border border-gray-300 checked:bg-gray-900"
                    checked={checkedIds.has(product.productId)}
                    onChange={(e) =>
                      handleCheck(product.productId, e.target.checked)
                    }
                    aria-label={`${product.productName} 선택`}
                  />
                </div>
              </td>
              <td className="w-[8%] px-3 py-3">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.productName}
                    className="mx-auto h-8 w-8 rounded object-cover"
                  />
                ) : (
                  <div className="mx-auto h-8 w-8 rounded bg-gray-300" />
                )}
              </td>
              <td className="w-[37%] py-3">{product.productName}</td>
              <td className="w-[15%] py-3">
                {product.price.toLocaleString()}원
              </td>
              <td className="w-[15%] py-3" onClick={(e) => e.stopPropagation()}>
                <input
                  type="number"
                  min={0}
                  className="w-16 rounded border border-gray-300 py-1 pl-3 text-center text-sm"
                  value={getDisplayStock(product)}
                  onChange={(e) =>
                    handleStockChange(product.productId, Number(e.target.value))
                  }
                />
              </td>
              <td className="w-[20%] py-3 text-gray-500">
                {formatDate(product.registeredAt)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};
