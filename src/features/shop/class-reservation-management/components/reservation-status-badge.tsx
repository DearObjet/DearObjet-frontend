type Status = 'CONFIRMED' | 'CANCELLED' | 'PENDING';

const statusStyles: Record<Status, string> = {
  CONFIRMED: 'bg-primary-bg',
  CANCELLED: 'bg-gray-900',
  PENDING: 'bg-orange',
};

const statusLabels: Record<Status, string> = {
  CONFIRMED: '확정',
  CANCELLED: '취소',
  PENDING: '대기',
};

export const ReservationStatusBadge = ({ status }: { status: Status }) => {
  return (
    <span
      className={`${statusStyles[status]} flex h-8 w-8 items-center justify-center rounded-full text-sm text-white`}
    >
      {statusLabels[status]}
    </span>
  );
};
