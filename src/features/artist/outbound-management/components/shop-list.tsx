import { Button } from '../../../../shared/components/ui';

import type { ShopListProps } from '../types/outbound-types';

export const ShopList = ({
  shops,
  selectedId,
  onRowClick,
  onOutboundView,
}: ShopListProps) => {
  return (
    <section className="flex min-h-[12rem] flex-1 flex-col overflow-hidden rounded-xl bg-white px-6 pb-5 pt-4">
      <header className="shrink-0 border-b pb-3">
        <h2 className="font-bold">입점 매장 목록</h2>
      </header>

      <table className="w-full table-fixed text-sm">
        <thead className="block w-full">
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
            <th className="w-[13%] py-3 pr-1" scope="col">
              출고리스트
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
          {shops.length === 0 ? (
            <tr className="table w-full">
              <td colSpan={7} className="py-10 text-center text-gray-400">
                등록된 매장이 없습니다.
              </td>
            </tr>
          ) : (
            shops.map((shop) => (
              <tr
                key={shop.id}
                className={`table w-full cursor-pointer text-center text-sm transition-colors hover:bg-gray-50 ${
                  selectedId === shop.id ? 'bg-gray-50' : ''
                }`}
                onClick={() => onRowClick(shop)}
              >
                <td className="w-[7%] py-2">
                  <div className="mx-auto h-9 w-9 rounded-full bg-gray-200" />
                </td>
                <td className="w-[20%] py-2">
                  <div className="truncate">{shop.name}</div>
                </td>
                <td className="w-[17%] py-2">
                  <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                    {shop.category}
                  </span>
                </td>
                <td className="w-[16%] py-2 text-gray-500">
                  {shop.contractStart}
                </td>
                <td className="w-[15%] py-2 text-gray-500">
                  {shop.contractEnd}
                </td>
                <td className="w-[12%] py-2">
                  <span
                    className={`text-xs ${
                      shop.outboundConfirm === '확인'
                        ? 'text-emerald-600'
                        : 'text-gray-400'
                    }`}
                  >
                    {shop.outboundConfirm}
                  </span>
                </td>
                <td
                  className="w-[12%] py-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Button
                    variant="secondaryDark"
                    className="px-4 py-1.5 text-xs"
                    label="열람"
                    onClick={() => onOutboundView(shop.id)}
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
