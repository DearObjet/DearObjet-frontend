import { useState, useEffect, useRef, type ChangeEvent } from 'react';
import { Search } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

import { Button } from '../../../../shared/components/ui';

import {
  useGetAvailableProductsQuery,
  useCreateShipmentMutation,
} from '../api/outbound-api';
import type { OutboundProductListProps } from '../types/outbound-management-types';
import { PAGE_SIZE } from '../constants/outbound-management-constants';

export const OutboundProductList = ({
  shopId,
  onOutboundSuccess,
}: OutboundProductListProps) => {
  const [checkedIds, setCheckedIds] = useState<Set<number>>(new Set());
  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const [inputValue, setInputValue] = useState('');
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(1);

  const versionsRef = useRef<Record<number, number>>({});
  const tableRef = useRef<HTMLTableElement>(null);

  const { data, isLoading, isFetching } = useGetAvailableProductsQuery(
    { shopId: shopId!, keyword, page, size: PAGE_SIZE },
    { skip: shopId === null }
  );

  const [createShipment, { isLoading: isCreating }] =
    useCreateShipmentMutation();

  useEffect(() => {
    setCheckedIds(new Set());
    setQuantities({});
    setInputValue('');
    setKeyword('');
    setPage(1);
    versionsRef.current = {};
  }, [shopId]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setKeyword(inputValue.trim());
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [inputValue]);

  useEffect(() => {
    data?.items.forEach((item) => {
      versionsRef.current[item.productId] = item.version ?? 0;
    });
  }, [data]);

  const products = data?.items ?? [];

  const isAllChecked =
    products.length > 0 && products.every((p) => checkedIds.has(p.productId));

  const handleCheckAll = (checked: boolean) => {
    setCheckedIds((prev) => {
      const next = new Set(prev);
      if (checked) products.forEach((p) => next.add(p.productId));
      else products.forEach((p) => next.delete(p.productId));
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
    setInputValue('');
    setKeyword('');
    setPage(1);
  };

  const handleOutbound = async () => {
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

    const currentVersionMap = Object.fromEntries(
      (data?.items ?? []).map((p) => [p.productId, p.version ?? 0])
    );

    try {
      await createShipment({
        shopId: shopId!,
        request: {
          items: selectedIds.map((productId) => ({
            productId,
            quantity: getQuantity(productId),
            version:
              currentVersionMap[productId] ??
              versionsRef.current[productId] ??
              0,
          })),
        },
      }).unwrap();

      setCheckedIds(new Set());
      setQuantities({});
      alert('출고가 완료되었습니다.');
      onOutboundSuccess();
    } catch {
      alert('출고 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  const handlePdfDownload = async () => {
    if (!tableRef.current) return;

    const canvas = await html2canvas(tableRef.current, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');

    const pdf = new jsPDF({ orientation: 'portrait', unit: 'px' });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const imgHeight = (canvas.height * pageWidth) / canvas.width;

    pdf.addImage(imgData, 'PNG', 0, 0, pageWidth, imgHeight);
    pdf.save('출고품목목록.pdf');
  };

  const isDisabled = isLoading || isFetching || isCreating;

  return (
    <section className="flex min-h-[12rem] flex-col overflow-hidden rounded-xl bg-white pb-5 pl-6 pr-4 pt-4">
      {/* 헤더 */}
      <header className="shrink-0 border-b pb-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="shrink-0 font-bold">
            품목{' '}
            <span className="font-normal text-blue-500">
              ({checkedIds.size}/{data?.items.length ?? 0})
            </span>
          </h2>

          <div className="mr-1.5 flex items-center gap-2">
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
                value={inputValue}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setInputValue(e.target.value)
                }
                aria-label="상품명 검색"
              />
            </div>
          </div>
        </div>
      </header>

      {/* 테이블 */}
      <table
        ref={tableRef}
        className="flex min-h-0 w-full flex-1 table-fixed flex-col text-sm"
      >
        <thead className="block w-full shrink-0 [scrollbar-gutter:stable]">
          <tr className="table w-full border-b text-center text-gray-500">
            <th className="w-[7%] py-3" scope="col">
              <div className="flex items-center justify-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 cursor-pointer appearance-none rounded border border-gray-300 checked:bg-gray-900 disabled:cursor-not-allowed disabled:opacity-40"
                  checked={isAllChecked}
                  onChange={(e) => handleCheckAll(e.target.checked)}
                  disabled={products.length === 0 || isDisabled}
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
            <th className="w-[18%] py-3" scope="col">
              출고수량
            </th>
          </tr>
        </thead>

        <tbody className="block min-h-0 flex-1 overflow-y-auto [scrollbar-gutter:stable]">
          {shopId === null ? (
            <tr className="table w-full">
              <td colSpan={5} className="py-10 text-center text-gray-400">
                매장을 선택하면 품목 목록이 표시됩니다.
              </td>
            </tr>
          ) : isLoading ? (
            <tr className="table w-full">
              <td colSpan={5} className="py-10 text-center text-gray-400">
                불러오는 중...
              </td>
            </tr>
          ) : products.length === 0 ? (
            <tr className="table w-full">
              <td colSpan={5} className="py-10 text-center text-gray-400">
                {keyword
                  ? '검색 결과가 없습니다.'
                  : '출고 가능한 상품이 없습니다.'}
              </td>
            </tr>
          ) : (
            products.map((product) => (
              <tr
                key={product.productId}
                className={`table w-full table-fixed text-center transition-colors hover:bg-gray-50 ${
                  checkedIds.has(product.productId) ? 'bg-gray-50' : ''
                } ${isFetching ? 'opacity-50' : ''}`}
              >
                <td className="w-[7%] py-2">
                  <div className="flex items-center justify-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 cursor-pointer appearance-none rounded border border-gray-300 checked:bg-gray-900"
                      checked={checkedIds.has(product.productId)}
                      onChange={(e) =>
                        handleCheck(product.productId, e.target.checked)
                      }
                      aria-label={`${product.productName} 선택`}
                    />
                  </div>
                </td>
                <td className="w-[10%] p-2">
                  {product.productImageUrl ? (
                    <img
                      src={product.productImageUrl}
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
                <td className="w-[45%] overflow-hidden py-2 text-center">
                  <div className="truncate">{product.productName}</div>
                </td>
                <td className="w-[20%] py-2">
                  {product.sellingPrice.toLocaleString()}원
                </td>
                <td className="w-[18%] py-2">
                  <input
                    type="number"
                    min={0}
                    max={product.totalQuantity}
                    className="w-16 rounded border border-gray-300 py-1 pl-4 text-center text-sm"
                    value={getQuantity(product.productId)}
                    onChange={(e) =>
                      handleQuantityChange(
                        product.productId,
                        Number(e.target.value)
                      )
                    }
                    aria-label={`${product.productName} 출고 수량 입력`}
                  />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* 푸터: 페이지네이션 + 버튼 */}
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
          label={isCreating ? '출고 중...' : '출고하기'}
          onClick={handleOutbound}
        />
      </footer>
    </section>
  );
};
