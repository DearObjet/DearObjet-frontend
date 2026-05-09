import { useState, useMemo, type ChangeEvent } from 'react';
import { Search } from 'lucide-react';

import { Button } from '../../../../shared/components/ui';

import type { OutboundProductListProps } from '../types/outbound-types';

export const OutboundProductList = ({
  products,
  onOutbound,
}: OutboundProductListProps) => {
  const [checkedIds, setCheckedIds] = useState<Set<number>>(new Set());
  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products;
    return products.filter((p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [products, searchQuery]);

  const isAllChecked =
    filteredProducts.length > 0 &&
    filteredProducts.every((p) => checkedIds.has(p.id));

  const handleCheckAll = (checked: boolean) => {
    setCheckedIds((prev) => {
      const next = new Set(prev);
      if (checked) filteredProducts.forEach((p) => next.add(p.id));
      else filteredProducts.forEach((p) => next.delete(p.id));
      return next;
    });
  };

  const handleCheck = (id: number, checked: boolean) => {
    setCheckedIds((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const getQuantity = (productId: number) => quantities[productId] ?? 0;

  const handleQuantityChange = (id: number, value: number) => {
    setQuantities((prev) => ({ ...prev, [id]: Math.max(0, value) }));
  };

  const handleReset = () => {
    setCheckedIds(new Set());
    setQuantities({});
    setSearchQuery('');
  };

  const handleOutbound = () => {
    const selectedIds = Array.from(checkedIds);
    if (selectedIds.length === 0) {
      alert('출고할 상품을 선택해주세요.');
      return;
    }
    const hasZeroQuantity = selectedIds.some((id) => getQuantity(id) === 0);
    if (hasZeroQuantity) {
      alert('수량이 0인 상품이 있습니다. 수량을 입력해주세요.');
      return;
    }
    onOutbound(
      selectedIds.map((productId) => ({
        productId,
        quantity: getQuantity(productId),
      }))
    );
  };

  const handlePdfDownload = () => {
    window.print();
  };

  return (
    <section className="flex min-h-[12rem] flex-col overflow-hidden rounded-xl bg-white px-6 pb-5 pt-4">
      <header className="shrink-0 border-b pb-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="shrink-0 font-bold">
            품목{' '}
            <span className="font-normal text-blue-500">
              ({checkedIds.size}/{products.length})
            </span>
          </h2>

          <div className="flex items-center gap-2">
            <Button
              variant="secondaryDark"
              className="shrink-0 px-4 py-2 text-xs"
              label="PDF로 내려받기"
              onClick={handlePdfDownload}
            />
            <div className="relative flex items-center">
              <Search
                className="absolute left-2.5 h-3.5 w-3.5 text-gray-400"
                aria-hidden="true"
              />
              <input
                type="text"
                className="w-50 rounded-md border border-gray-300 py-2 pl-8 pr-3 text-xs outline-none focus:ring-1 focus:ring-gray-400"
                placeholder="상품명 검색"
                value={searchQuery}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setSearchQuery(e.target.value)
                }
                aria-label="상품명 검색"
              />
            </div>
          </div>
        </div>
      </header>

      <table className="w-full table-fixed text-sm">
        <thead className="block w-full">
          <tr className="table w-full border-b text-center text-gray-500">
            <th className="w-[7%] py-3" scope="col">
              <div className="flex items-center justify-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 cursor-pointer appearance-none rounded border border-gray-300 checked:bg-gray-900 disabled:cursor-not-allowed disabled:opacity-40"
                  checked={isAllChecked}
                  onChange={(e) => handleCheckAll(e.target.checked)}
                  disabled={filteredProducts.length === 0}
                  aria-label="전체 선택"
                />
              </div>
            </th>
            <th className="w-[10%] py-3" scope="col" />
            <th className="w-[45%] py-3" scope="col">
              상품명
            </th>
            <th className="w-[20%] py-3" scope="col">
              판매가
            </th>
            <th className="w-[18%] py-3 pr-2.5" scope="col">
              입고수량
            </th>
          </tr>
        </thead>

        <tbody
          className="block overflow-y-auto"
          style={{
            maxHeight: 'calc(100vh - 12rem)',
            scrollbarGutter: 'stable',
          }}
        >
          {products.length === 0 ? (
            <tr className="table w-full">
              <td colSpan={5} className="py-10 text-center text-gray-400">
                매장을 선택하면 품목 목록이 표시됩니다.
              </td>
            </tr>
          ) : filteredProducts.length === 0 ? (
            <tr className="table w-full">
              <td colSpan={5} className="py-10 text-center text-gray-400">
                검색 결과가 없습니다.
              </td>
            </tr>
          ) : (
            filteredProducts.map((product) => (
              <tr
                key={product.id}
                className={`table w-full text-center transition-colors hover:bg-gray-50 ${
                  checkedIds.has(product.id) ? 'bg-gray-50' : ''
                }`}
              >
                <td className="w-[7%] py-2">
                  <div className="flex items-center justify-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 cursor-pointer appearance-none rounded border border-gray-300 checked:bg-gray-900"
                      checked={checkedIds.has(product.id)}
                      onChange={(e) =>
                        handleCheck(product.id, e.target.checked)
                      }
                      aria-label={`${product.name} 선택`}
                    />
                  </div>
                </td>
                <td className="w-[10%] px-2 py-2">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="mx-auto h-9 w-9 rounded object-cover"
                    />
                  ) : (
                    <div
                      className="mx-auto h-9 w-9 rounded bg-gray-200"
                      aria-hidden="true"
                    />
                  )}
                </td>
                <td className="w-[45%] py-2 pl-2 text-left">
                  <div className="truncate">{product.name}</div>
                </td>
                <td className="w-[20%] py-2">
                  {product.price.toLocaleString()}원
                </td>
                <td className="w-[17%] py-2">
                  <input
                    type="number"
                    min={0}
                    className="w-16 rounded border border-gray-300 py-1 pl-4 text-center text-sm"
                    value={getQuantity(product.id)}
                    onChange={(e) =>
                      handleQuantityChange(product.id, Number(e.target.value))
                    }
                    aria-label={`${product.name} 수량 입력`}
                  />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <footer className="flex shrink-0 justify-end gap-1.5 border-t pt-3">
        <Button
          variant="secondaryLight"
          className="px-5 py-2 text-xs"
          label="되돌리기"
          onClick={handleReset}
        />
        <Button
          variant="secondaryDark"
          className="px-5 py-2 text-xs"
          label="출고하기"
          onClick={handleOutbound}
        />
      </footer>
    </section>
  );
};
