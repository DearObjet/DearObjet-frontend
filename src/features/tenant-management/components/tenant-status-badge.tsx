import { Button } from '../../../shared/components/ui';

export type TenantStatus =
  | '계약완료'
  | '계약대기'
  | '계약연장'
  | '계약중'
  | '해제승인'
  | '계약 대기'
  | '계약 완료';

interface TenantStatusBadgeProps {
  status: TenantStatus;
}

export const TenantStatusBadge = ({ status }: TenantStatusBadgeProps) => {
  if (status === '계약연장') {
    return <Button variant="secondaryDark" size="small" label="계약연장" />;
  }

  return <span className="text-gray-700">{status}</span>;
};
