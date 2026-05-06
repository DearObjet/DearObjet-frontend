import { useState } from 'react';

import { Button } from '../../../shared/components/ui';

import { TenantStatusBadge } from './tenant-status-badge';
import type { TenantStatus } from './tenant-status-badge';

interface TenantListTableRowProps {
  index: number;
  shopName: string;
  contractStart: string;
  contractEnd: string;
  status: TenantStatus;
  onView: () => void;
}

export const TenantListTableRow = ({
  index,
  shopName,
  contractStart,
  contractEnd,
  status,
  onView,
}: TenantListTableRowProps) => {
  const [isCanceled, setIsCanceled] = useState(false);

  return (
    <tr className="border-b border-gray-100 text-center text-sm">
      <td className="py-2 text-gray-500">{index}</td>
      <td className="py-2">{shopName}</td>
      <td className="py-2 text-gray-500">{contractStart}</td>
      <td className="py-2 text-gray-500">{contractEnd}</td>
      <td className="py-2">
        <TenantStatusBadge status={status} />
      </td>
      <td className="py-2">
        <Button
          variant="secondaryDark"
          size="small"
          label={isCanceled ? '해제취소' : '해제신청'}
          onClick={() => setIsCanceled((prev) => !prev)}
        />
      </td>
      <td className="py-2">
        <Button
          variant="primary"
          className="w-[4.6875rem]"
          size="small"
          label="보기"
          onClick={onView}
        />
      </td>
    </tr>
  );
};
