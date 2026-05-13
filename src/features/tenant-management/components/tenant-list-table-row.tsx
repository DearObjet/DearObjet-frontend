import { Button } from '../../../shared/components/ui';
import { useAppSelector } from '../../../app/hooks';

import {
  useReleaseRequestMutation,
  useReleaseCancellationMutation,
  useApproveContractMutation,
} from '../api/artist-tenant-api';
import { TenantStatusBadge } from './tenant-status-badge';
import type { TenantStatus } from '../components/tenant-list-table';

interface TenantListTableRowProps {
  index: number;
  contractId: number;
  shopName: string;
  contractStart: string;
  contractEnd: string;
  status: TenantStatus;
  nextAction: {
    code: string;
    label: string;
  };
  onView: () => void;
}

export const TenantListTableRow = ({
  index,
  contractId,
  shopName,
  contractStart,
  contractEnd,
  status,
  nextAction,
  onView,
}: TenantListTableRowProps) => {
  const userId = useAppSelector((state) => state.auth.user?.userId);

  const [releaseRequest] = useReleaseRequestMutation();
  const [releaseCancellation] = useReleaseCancellationMutation();
  const [approveContract] = useApproveContractMutation();

  const handleActionClick = () => {
    if (!userId) return;

    if (nextAction.code === 'RELEASE_REQUEST') {
      releaseRequest({ contractId, userId });
    } else if (nextAction.code === 'RELEASE_CANCELLATION') {
      releaseCancellation({ contractId, userId });
    } else if (nextAction.code === 'CONTRACT_APPROVE') {
      approveContract({ contractId, userId });
    }
  };

  const isDisabled = nextAction.code === 'WAITING_ARTIST_SUBMISSION';

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
        {nextAction.code !== 'NONE' ? (
          <Button
            variant="secondaryDark"
            size="small"
            label={nextAction.label}
            onClick={handleActionClick}
            disabled={isDisabled}
          />
        ) : (
          <Button
            variant="secondaryDark"
            size="small"
            label={nextAction.label}
            disabled
          />
        )}
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
