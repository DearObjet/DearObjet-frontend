import { Button } from '../../../../shared/components/ui';

import type {
  CommissionType,
  OutboundListProps,
} from '../types/outbound-management-types';
import {
  STATUS_LABEL,
  STATUS_STYLE,
} from '../constants/outbound-management-constants';

const formatCommission = (type: CommissionType, value: number): string =>
  type === 'RATE' ? `${value}%` : `${value.toLocaleString()}원`;

export const OutboundList = ({
  data,
  isRecentMode,
  onToggleMode,
}: OutboundListProps) => {
  const contracts = data?.contracts ?? [];
  const totalItemCount = contracts.reduce((sum, c) => sum + c.items.length, 0);

  return (
    <section className="flex min-h-[12rem] flex-1 flex-col overflow-hidden rounded-xl bg-white pb-5 pl-6 pr-4 pt-4">
      <header className="flex shrink-0 items-center justify-between border-b pb-3">
        <h2 className="font-bold">
          {isRecentMode ? '최근출고내역' : '전체출고'}
          {!isRecentMode && totalItemCount > 0 && (
            <span className="ml-2 font-normal text-blue-500">
              {totalItemCount}
            </span>
          )}
        </h2>
        <Button
          variant="secondaryDark"
          className="mr-1.5 px-4 py-2 text-xs"
          label={isRecentMode ? '전체출고 열람' : '최근출고내역 열람'}
          onClick={onToggleMode}
        />
      </header>

      <table className="flex min-h-0 w-full flex-1 table-fixed flex-col text-sm">
        <thead className="block w-full shrink-0 [scrollbar-gutter:stable]">
          <tr className="table w-full border-b text-center text-gray-500">
            <th className="w-[10%] py-3" scope="col" />
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
            <th className="w-[18%] py-3" scope="col">
              개당 정산금액
            </th>
          </tr>
        </thead>

        <tbody className="block min-h-0 flex-1 overflow-y-auto [scrollbar-gutter:stable]">
          {totalItemCount === 0 ? (
            <tr className="table w-full">
              <td colSpan={6} className="py-10 text-center text-gray-400">
                {isRecentMode
                  ? '최근 출고 내역이 없습니다.'
                  : '매장의 열람 버튼을 눌러 출고 내역을 확인하세요.'}
              </td>
            </tr>
          ) : (
            contracts.map((contract) => (
              <>
                {!isRecentMode && (
                  <tr
                    key={`header-${contract.contractId}`}
                    className="table w-full text-center"
                  >
                    <td colSpan={6} className="bg-gray-50 px-3 py-2">
                      <span className="text-xs font-medium text-gray-600">
                        {contract.contractStartDate} ~{' '}
                        {contract.contractEndDate}
                      </span>
                      <span
                        className={`ml-2 rounded-full px-2 py-0.5 text-xs ${
                          STATUS_STYLE[contract.contractStatus] ??
                          'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {STATUS_LABEL[contract.contractStatus] ??
                          contract.contractStatus}
                      </span>
                    </td>
                  </tr>
                )}
                {contract.items.map((item) => (
                  <tr
                    key={item.contractProductId}
                    className="table w-full table-fixed text-center hover:bg-gray-50"
                  >
                    <td className="w-[10%] py-2">
                      <div className="mx-auto h-9 w-9 rounded bg-gray-200" />
                    </td>
                    <td className="w-[35%] overflow-hidden py-2 text-center">
                      <div className="truncate">{item.productName}</div>
                    </td>
                    <td className="w-[15%] py-2">
                      {item.sellingPrice.toLocaleString()}원
                    </td>
                    <td className="w-[12%] py-2">
                      {item.totalShipmentQuantity}개
                    </td>
                    <td className="w-[10%] py-2">
                      {formatCommission(
                        item.commissionType,
                        item.commissionValue
                      )}
                    </td>
                    <td className="w-[18%] py-2">
                      {item.unitSettlementAmount.toLocaleString()}원
                    </td>
                  </tr>
                ))}
              </>
            ))
          )}
        </tbody>
      </table>
    </section>
  );
};
