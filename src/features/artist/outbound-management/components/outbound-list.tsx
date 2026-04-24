import { Button } from '../../../../shared/components/ui';

import type { OutboundListProps } from '../types/outbound';

export const OutboundList = ({
  records,
  isRecentMode,
  onToggleMode,
}: OutboundListProps) => {
  return (
    <section className="flex min-h-[12rem] flex-1 flex-col overflow-hidden rounded-xl bg-white px-6 pb-5 pt-4">
      <header className="flex shrink-0 items-center justify-between border-b pb-3">
        <h2 className="font-bold">
          {isRecentMode ? '최근출고내역' : '전체출고'}
          {!isRecentMode && records.length > 0 && (
            <span className="ml-2 font-normal text-blue-500">
              {records.length}
            </span>
          )}
        </h2>
        <Button
          variant="secondaryDark"
          className="px-4 py-2 text-xs"
          label={isRecentMode ? '전체출고 열람' : '최근출고내역 열람'}
          onClick={onToggleMode}
        />
      </header>

      <table className="w-full table-fixed text-sm">
        <thead className="block w-full">
          <tr className="table w-full border-b text-center text-gray-500">
            <th className="bg-re-300 w-[10%] py-3" scope="col" />
            <th className="w-[35%] py-3" scope="col">
              상품명
            </th>
            <th className="w-[15%] py-3" scope="col">
              판매가
            </th>
            <th className="w-[12%] py-3" scope="col">
              출고수량
            </th>
            <th className="w-[10%] py-3" scope="col">
              수수료
            </th>
            <th className="w-[18%] py-3 pr-2" scope="col">
              개당 정산금액
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
          {records.length === 0 ? (
            <tr className="table w-full">
              <td colSpan={6} className="py-10 text-center text-gray-400">
                {isRecentMode
                  ? '최근 출고 내역이 없습니다.'
                  : '매장의 열람 버튼을 눌러 출고 내역을 확인하세요.'}
              </td>
            </tr>
          ) : (
            records.map((record) => (
              <tr
                key={record.id}
                className="table w-full text-center hover:bg-gray-50"
              >
                <td className="w-[10%] py-2">
                  <div className="mx-auto h-9 w-9 rounded bg-gray-200" />
                </td>
                <td className="w-[35%] py-2 text-left">
                  <div className="truncate">{record.productName}</div>
                </td>
                <td className="w-[15%] py-2">
                  {record.price.toLocaleString()}원
                </td>
                <td className="w-[12%] py-2">{record.quantity}개</td>
                <td className="w-[10%] py-2">{record.commission}</td>
                <td className="w-[17%] py-2">
                  {record.settlement.toLocaleString()}원
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </section>
  );
};
