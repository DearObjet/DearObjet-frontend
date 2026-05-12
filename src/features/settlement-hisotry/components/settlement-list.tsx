import { Button } from '../../../shared/components/ui';

import type { SettlementListProps } from '../types/settlement-history-types';

export const SettlementList = ({ items, isLoading }: SettlementListProps) => {
  return (
    <section className="flex min-h-[12rem] flex-1 flex-col overflow-hidden rounded-xl bg-white pb-5 pl-6 pr-4 pt-4">
      <header className="shrink-0 border-b pb-3">
        <h2 className="font-bold">
          정산내역
          {items.length > 0 && (
            <span className="ml-2 font-normal text-blue-500">
              {items.length}
            </span>
          )}
        </h2>
      </header>

      <table className="flex min-h-0 w-full flex-1 table-fixed flex-col text-sm">
        <thead className="block w-full shrink-0 [scrollbar-gutter:stable]">
          <tr className="table w-full border-b text-center text-gray-500">
            <th className="w-[8%] py-3" scope="col">
              번호
            </th>
            <th className="w-[18%] py-3" scope="col">
              매장
            </th>
            <th className="w-[16%] py-3" scope="col">
              정산금액
            </th>
            <th className="w-[16%] py-3" scope="col">
              정산날짜
            </th>
            <th className="w-[28%] py-3" scope="col">
              식별번호
            </th>
            <th className="w-[14%] py-3" scope="col">
              세금계산서
            </th>
          </tr>
        </thead>

        <tbody className="block min-h-0 flex-1 overflow-y-auto [scrollbar-gutter:stable]">
          {isLoading ? (
            <tr className="table w-full">
              <td colSpan={6} className="py-10 text-center text-gray-400">
                불러오는 중...
              </td>
            </tr>
          ) : items.length === 0 ? (
            <tr className="table w-full">
              <td colSpan={6} className="py-10 text-center text-gray-400">
                정산내역이 없습니다.
              </td>
            </tr>
          ) : (
            items.map((item, index) => (
              <tr
                key={item.settlementId}
                className="table w-full table-fixed text-center transition-colors hover:bg-gray-50"
              >
                <td className="w-[8%] py-3 text-gray-500">{index + 1}</td>
                <td className="w-[18%] overflow-hidden py-3">
                  <div className="truncate">{item.shopName}</div>
                </td>
                <td className="w-[16%] py-3">
                  {item.amount.toLocaleString()}원
                </td>
                <td className="w-[16%] py-3 text-gray-500">
                  {item.settlementDate}
                </td>
                <td className="w-[28%] py-3 font-mono text-xs text-gray-600">
                  {item.identifier}
                </td>
                <td className="w-[14%] py-3">
                  <Button
                    variant="secondaryDark"
                    className="px-4 py-1.5 text-xs"
                    label="보내기"
                    onClick={() =>
                      alert('세금계산서 보내기는 준비중인 서비스입니다.')
                    }
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
