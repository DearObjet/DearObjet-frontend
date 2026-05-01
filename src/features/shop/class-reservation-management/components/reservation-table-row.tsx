import type { Reservation } from '../types/reservation-types';
import { ReservationStatusBadge } from './reservation-status-badge';

interface ReservationTableRowProps {
  data: Reservation;
  checked: boolean;
  onCheck: (id: string) => void;
}

export const ReservationTableRow = ({
  data,
  checked,
  onCheck,
}: ReservationTableRowProps) => {
  return (
    <tr className="text-sm">
      <td className="w-10 py-3">
        <input
          type="checkbox"
          checked={checked}
          onChange={() => onCheck(data.id)}
        />
      </td>
      <td className="py-3">
        <ReservationStatusBadge status={data.status} />
      </td>
      <td className="py-3">{data.name}</td>
      <td className="py-3">{data.phone}</td>
      <td className="py-3">{data.reservationNumber}</td>
      <td className="py-3">{data.datetime}</td>
      <td className="py-3">{data.className}</td>
      <td className="py-3">{data.headcount}명</td>
      <td className="py-3">{data.memo}</td>
    </tr>
  );
};
