import type { Reservation } from '../types/reservation-types';
import { ReservationStatusBadge } from './reservation-status-badge';

interface ReservationTableRowProps {
  data: Reservation;
  checked: boolean;
  onCheck: (id: number) => void;
}

export const ReservationTableRow = ({
  data,
  checked,
  onCheck,
}: ReservationTableRowProps) => {
  const formattedTime = new Date(data.usageDateTime).toLocaleString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <tr
      className="cursor-pointer text-sm hover:bg-gray-50"
      onClick={() => onCheck(data.reservationId)}
    >
      <td className="w-10 py-3">
        <input
          type="checkbox"
          checked={checked}
          onChange={() => onCheck(data.reservationId)}
          onClick={(e) => e.stopPropagation()}
        />
      </td>
      <td className="py-3">
        <ReservationStatusBadge status={data.status} />
      </td>
      <td className="py-3">{data.reserverName}</td>
      <td className="py-3">{data.phoneNumber}</td>
      <td className="py-3">{data.reservationId}</td>
      <td className="py-3">{formattedTime}</td>
      <td className="py-3">{data.className}</td>
      <td className="py-3">-</td>
    </tr>
  );
};
