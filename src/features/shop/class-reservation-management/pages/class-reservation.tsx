import { useState } from 'react';

import { DearObjetCalendar } from '../../../../shared/components/common/dear-objet-calendar';

import { Button } from '../../../../shared/components/ui';
import { ReservationTable } from '../components/reservation-table';

const MOCK_RESERVATIONS = [
  {
    id: '1',
    status: '확정' as const,
    name: '김가영',
    phone: '010-7147-0779',
    reservationNumber: '135484',
    datetime: '2025.09.21 오후 1:00',
    className: '나만의 키링 만들기',
    headcount: 3,
    memo: '아이들과 함께 방문 예정입니다',
  },
  {
    id: '2',
    status: '확정' as const,
    name: '최재호',
    phone: '010-7147-0779',
    reservationNumber: '135485',
    datetime: '2025.09.21 오후 1:00',
    className: '나만의 키링 만들기',
    headcount: 3,
    memo: '기대됩니다!',
  },
  {
    id: '3',
    status: '확정' as const,
    name: '배주완',
    phone: '010-7147-0779',
    reservationNumber: '135486',
    datetime: '2025.09.21 오후 1:00',
    className: '나만의 키링 만들기',
    headcount: 3,
    memo: '변동 시 연락드릴게요!',
  },
  {
    id: '4',
    status: '취소' as const,
    name: '남현정',
    phone: '010-7147-0779',
    reservationNumber: '135486',
    datetime: '2025.09.21 오후 1:00',
    className: '나만의 키링 만들기',
    headcount: 3,
    memo: '변동 시 연락드릴게요!',
  },
  {
    id: '5',
    status: '대기' as const,
    name: '박다솜',
    phone: '010-7147-0779',
    reservationNumber: '135486',
    datetime: '2025.09.21 오후 1:00',
    className: '나만의 키링 만들기',
    headcount: 3,
    memo: '변동 시 연락드릴게요!',
  },
  {
    id: '6',
    status: '대기' as const,
    name: '박다솜',
    phone: '010-7147-0779',
    reservationNumber: '135486',
    datetime: '2025.09.21 오후 1:00',
    className: '나만의 키링 만들기',
    headcount: 3,
    memo: '변동 시 연락드릴게요!',
  },
  {
    id: '9',
    status: '대기' as const,
    name: '박다솜',
    phone: '010-7147-0779',
    reservationNumber: '135486',
    datetime: '2025.09.21 오후 1:00',
    className: '나만의 키링 만들기',
    headcount: 3,
    memo: '변동 시 연락드릴게요!',
  },
];

export const ClassReservation = () => {
  const [date, setDate] = useState<Date | null>(null);

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
            예약현황 <span>3</span>
          </h3>
          <div className="flex gap-2">
            <Button label="확정" />
            <Button label="반려" variant="secondaryDark" />
          </div>
        </div>
        <div>
          <ReservationTable data={MOCK_RESERVATIONS} />
        </div>
      </section>
    </div>
  );
};
