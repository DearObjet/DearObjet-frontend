import { Button } from '../../../../shared/components/ui';

import type { ShopListProps } from '../types/outbound-management-types';
import { SPECIALTY_LABEL } from '../constants/outbound-management-constants';

export const ShopList = ({
  shops,
  isLoading,
  selectedId,
  onRowClick,
  onOutboundView,
}: ShopListProps) => {
  return (
    <section className="flex min-h-[12rem] flex-1 flex-col overflow-hidden rounded-xl bg-white pb-5 pl-6 pr-4 pt-4">
      <header className="shrink-0 border-b pb-3">
        <h2 className="font-bold">입점 매장 목록</h2>
      </header>

      <table className="flex min-h-0 w-full flex-1 table-fixed flex-col text-sm">
        <thead className="block w-full shrink-0 [scrollbar-gutter:stable]">
          <tr className="table w-full border-b text-center text-gray-500">
            <th className="w-[7%] py-3" scope="col" />
            <th className="w-[20%] py-3" scope="col">
              매장
            </th>
            <th className="w-[17%] py-3" scope="col">
              매장분류
            </th>
            <th className="w-[16%] py-3" scope="col">
              최초계약일
            </th>
            <th className="w-[15%] py-3" scope="col">
              계약종료일
            </th>
            <th className="w-[12%] py-3" scope="col">
              출고확인
            </th>
            <th className="w-[13%] py-3" scope="col">
              출고리스트
            </th>
          </tr>
        </thead>

        <tbody className="block min-h-0 flex-1 overflow-y-auto [scrollbar-gutter:stable]">
          {isLoading ? (
            <tr className="table w-full">
              <td colSpan={7} className="py-10 text-center text-gray-400">
                불러오는 중...
              </td>
            </tr>
          ) : shops.length === 0 ? (
            <tr className="table w-full">
              <td colSpan={7} className="py-10 text-center text-gray-400">
                등록된 매장이 없습니다.
              </td>
            </tr>
          ) : (
            shops.map((shop) => (
              <tr
                key={shop.shopId}
                className={`table w-full table-fixed cursor-pointer text-center text-sm transition-colors hover:bg-gray-50 ${
                  selectedId === shop.shopId ? 'bg-gray-50' : ''
                }`}
                onClick={() => onRowClick(shop)}
              >
                <td className="w-[7%] py-2">
                  <div className="mx-auto h-9 w-9 rounded-full bg-gray-200" />
                </td>
                <td className="w-[20%] overflow-hidden py-2">
                  <div className="truncate">{shop.name}</div>
                </td>
                <td className="w-[17%] py-2">
                  <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                    {SPECIALTY_LABEL[shop.category] ?? shop.category}
                  </span>
                </td>
                <td className="w-[16%] py-2 text-gray-500">
                  {shop.contractStart}
                </td>
                <td className="w-[15%] py-2 text-gray-500">
                  {shop.contractEnd}
                </td>
                <td className="w-[12%] py-2">
                  <span className={'text-xs text-gray-400'}>
                    {shop.statusLabel}
                  </span>
                </td>
                <td
                  className="w-[13%] py-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Button
                    variant="secondaryDark"
                    className="px-4 py-1.5 text-xs"
                    label="열람"
                    onClick={() => onOutboundView(shop.shopId)}
                  />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </section>
  );
};
