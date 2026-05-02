import { useState } from 'react';

import { DearObjetCalendar } from '../../../../shared/components/common/dear-objet-calendar';
import { Button } from '../../../../shared/components/ui';

import {
  useGetClassReservationsQuery,
  useConfirmReservationMutation,
  useCancelReservationMutation,
} from '../api/class-reservation-api';
import { ReservationTable } from '../components/reservation-table';

export const ClassReservation = () => {
  const [date, setDate] = useState<Date | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  const year = date ? date.getFullYear() : new Date().getFullYear();
  const month = date ? date.getMonth() + 1 : new Date().getMonth() + 1;

  const { data } = useGetClassReservationsQuery({ year, month });
  const [confirmReservation] = useConfirmReservationMutation();
  const [cancelReservation] = useCancelReservationMutation();

  const filteredReservations = (data?.reservations ?? []).filter((r) => {
    if (!date) return true;
    const reservationDate = new Date(r.reservationTime);
    return (
      reservationDate.getFullYear() === date.getFullYear() &&
      reservationDate.getMonth() === date.getMonth() &&
      reservationDate.getDate() === date.getDate()
    );
  });

  const handleConfirm = async () => {
    if (selectedIds.size === 0) return;
    await Promise.all([...selectedIds].map((id) => confirmReservation(id)));
    setSelectedIds(new Set());
  };

  const handleCancel = async () => {
    if (selectedIds.size === 0) return;

    const selectedReservations = filteredReservations.filter((r) =>
      selectedIds.has(r.reservationId)
    );
    const hasNonPending = selectedReservations.some(
      (r) => r.status !== 'PENDING'
    );

    if (hasNonPending) {
      alert('예약 확정 혹은 반려는 대기 상태인 예약만 가능합니다.');
      return;
    }

    await Promise.all([...selectedIds].map((id) => cancelReservation(id)));
    setSelectedIds(new Set());
  };

  return (
    <div className="flex h-full w-full flex-col gap-3">
      <div className="flex gap-3">
        <section className="h-[31.25rem] w-[45.1875rem] shrink-0 rounded-xl bg-white">
          <h3 className="hidden">캘린더</h3>
          <DearObjetCalendar
            value={date}
            onChange={(selectedDate) => setDate(selectedDate)}
          />
        </section>

        <section className="flex h-[31.25rem] w-full flex-col justify-center rounded-xl bg-white text-center">
          <h3>예약 확정 혹은 반려 알림톡/혹은 문자 보내기</h3>
          <p>준비중인 서비스입니다.</p>
        </section>
      </div>

      <section className="h-full w-full rounded-xl bg-white px-[3.125rem] pb-[1.6875rem] pt-4">
        <div className="flex justify-between">
          <h3 className="flex items-center justify-between pb-3">
            예약현황 <span>{filteredReservations.length}</span>
          </h3>
          <div className="flex gap-2">
            <Button label="확정" onClick={handleConfirm} />
            <Button
              label="반려"
              variant="secondaryDark"
              onClick={handleCancel}
            />
          </div>
        </div>
        <div>
          <ReservationTable
            data={filteredReservations}
            selectedIds={selectedIds}
            onSelectedIdsChange={setSelectedIds}
          />
        </div>
      </section>
    </div>
  );
};
