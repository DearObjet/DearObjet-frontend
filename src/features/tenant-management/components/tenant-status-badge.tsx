import { Button } from '../../../shared/components/ui';

export type TenantStatus =
  | '계약완료'
  | '계약대기'
  | '계약연장'
  | '계약중'
  | '해제승인'
  | '계약 대기'
  | '계약 완료'
  | '계약 연장';

interface TenantStatusBadgeProps {
  status: TenantStatus;
  onExtension?: () => void;
}

export const TenantStatusBadge = ({
  status,
  onExtension,
}: TenantStatusBadgeProps) => {
  if (status === '계약연장' || status === '계약 연장') {
    return (
      <Button
        variant="secondaryDark"
        size="small"
        label="계약연장"
        onClick={onExtension}
      />
    );
  }
  return <span className="text-gray-700">{status}</span>;
};
