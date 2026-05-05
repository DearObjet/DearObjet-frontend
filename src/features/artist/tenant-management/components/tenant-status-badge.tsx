import { Button } from '../../../../shared/components/ui';

export type TenantStatus = '계약완료' | '계약대기' | '계약연장';

interface TenantStatusBadgeProps {
  status: TenantStatus;
}

export const TenantStatusBadge = ({ status }: TenantStatusBadgeProps) => {
  if (status === '계약연장') {
    return <Button variant="secondaryDark" size="small" label="계약연장" />;
  }

  const statusClasses: Record<Exclude<TenantStatus, '계약연장'>, string> = {
    계약완료: 'text-gray-700',
    계약대기: 'text-gray-700',
  };

  return <span className={statusClasses[status]}>{status}</span>;
};
