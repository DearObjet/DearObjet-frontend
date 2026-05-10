import { TenantListTableRow } from './tenant-list-table-row';
import type { TenantStatus } from './tenant-status-badge';

export type { TenantStatus };

interface TenantItem {
  id: string;
  shopName: string;
  contractStart: string;
  contractEnd: string;
  status: TenantStatus;
  contract: string;
  nextAction: {
    code: string;
    label: string;
  };
  detailAvailable: boolean;
}

interface TenantListTableProps {
  items: TenantItem[];
  onView: (id: string) => void;
  variant?: 'artist' | 'shop';
}

const COL_WIDTHS = ['44px', '67px', '54px', '59px', '67px', '59px', '59px'];

const Colgroup = () => (
  <colgroup>
    {COL_WIDTHS.map((w, i) => (
      <col key={i} style={{ width: w }} />
    ))}
  </colgroup>
);

export const TenantListTable = ({
  items,
  onView,
  variant = 'artist',
}: TenantListTableProps) => {
  const nameHeader = variant === 'artist' ? '매장명' : '작가명';

  return (
    <div className="w-full px-[1.6875rem] pt-[1.625rem]">
      <table className="w-full table-fixed">
        <Colgroup />
        <thead>
          <tr className="border-b border-gray-200 text-center text-sm text-gray-500">
            <th className="py-4 font-medium">번호</th>
            <th className="py-4 font-medium">{nameHeader}</th>
            <th className="py-4 font-medium">계약시작일</th>
            <th className="py-4 font-medium">계약종료일</th>
            <th className="py-4 font-medium">상태</th>
            <th className="py-4 font-medium">상태변경</th>
            <th className="py-4 font-medium">계약서</th>
          </tr>
        </thead>
      </table>

      <div className="max-h-[32rem] overflow-y-auto">
        <table className="w-full table-fixed">
          <Colgroup />
          <tbody>
            {items.map((item, i) => (
              <TenantListTableRow
                key={item.id}
                index={i + 1}
                contractId={Number(item.id)}
                shopName={item.shopName}
                contractStart={item.contractStart}
                contractEnd={item.contractEnd}
                status={item.status}
                nextAction={item.nextAction}
                onView={() => onView(item.id)}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
