type Status = '확정' | '취소' | '대기';

const statusStyles: Record<Status, string> = {
  확정: 'bg-primary-bg',
  취소: 'bg-gray-900',
  대기: 'bg-orange',
};

export const ReservationStatusBadge = ({ status }: { status: Status }) => {
  return (
    <span
      className={`${statusStyles[status]} flex h-8 w-8 items-center justify-center rounded-full text-sm text-white`}
    >
      {status}
    </span>
  );
};
