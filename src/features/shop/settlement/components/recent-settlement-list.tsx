import type { RecentSettlementListProps } from '../types/settlement-calculation-types';

export const RecentSettlementList = ({
  settlements,
  isLoading,
}: RecentSettlementListProps) => {
  return (
    <section className="flex flex-col overflow-hidden rounded-xl bg-white px-6 pb-5 pt-4">
      <header className="shrink-0 border-b pb-3">
        <h2 className="font-bold">최근 정산 완료 항목</h2>
      </header>

      <table className="w-full table-fixed text-sm">
        <thead className="block w-full">
          <tr className="table w-full border-b text-center text-gray-500">
            <th className="w-[10%] py-3" scope="col">
              번호
            </th>
            <th className="w-[22%] py-3" scope="col">
              작가
            </th>
            <th className="w-[26%] py-3" scope="col">
              정산금액
            </th>
            <th className="w-[26%] py-3" scope="col">
              정산날짜
            </th>
            <th className="w-[16%] py-3" scope="col">
              정산방식
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
          {isLoading ? (
            <tr className="table w-full">
              <td colSpan={5} className="py-10 text-center text-gray-400">
                불러오는 중...
              </td>
            </tr>
          ) : settlements.length === 0 ? (
            <tr className="table w-full">
              <td colSpan={5} className="py-10 text-center text-gray-400">
                최근 정산 내역이 없습니다.
              </td>
            </tr>
          ) : (
            settlements.map((settlement) => (
              <tr
                key={settlement.id}
                className="table w-full text-center text-sm transition-colors hover:bg-gray-50"
              >
                <td className="w-[10%] py-3 text-gray-400">
                  {settlement.rank}
                </td>
                <td className="w-[22%] py-3">
                  <div className="truncate">{settlement.artistName}</div>
                </td>
                <td className="w-[26%] py-3 font-medium">
                  {settlement.settlementAmount.toLocaleString()}원
                </td>
                <td className="w-[26%] py-3 text-gray-500">
                  {settlement.settlementDate}
                </td>
                <td className="w-[16%] py-3">
                  <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                    {settlement.paymentMethodLabel}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </section>
  );
};
