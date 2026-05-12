// import { useState } from 'react';
import { useNavigate } from 'react-router';

import { ROUTES } from '../../../shared/constants';
import { Button } from '../../../shared/components/ui';
import {
  useGetMyReservationsQuery,
  useCancelReservationMutation,
} from '../api/my-page-api';
import { MyPageLayout } from './my-page-layout';

const formatDateTime = (isoString: string) => {
  const date = new Date(isoString);
  return date.toLocaleString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const MyReservations = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useGetMyReservationsQuery();
  const [cancelReservation] = useCancelReservationMutation();

  const handleChangeClick = async (reservationNumber: number) => {
    const confirmed = window.confirm(
      '예약 변경시, 기존 예약이 자동 취소됩니다. 변경하시겠습니까?'
    );
    if (!confirmed) return;

    await cancelReservation(reservationNumber);
    navigate(ROUTES.MAP);
  };

  const handleCancelClick = async (reservationNumber: number) => {
    const confirmed = window.confirm('예약을 취소하시겠습니까?');
    if (!confirmed) return;

    await cancelReservation(reservationNumber);
  };

  if (isLoading)
    return (
      <MyPageLayout>
        <p>로딩 중...</p>
      </MyPageLayout>
    );

  return (
    <MyPageLayout>
      <div className="flex w-[43.562rem] flex-col gap-12 text-[26px]">
        <section className="flex flex-col gap-5">
          <h2>예약 현황</h2>
          {!data?.currentReservations?.length ? (
            <p className="text-base text-gray-400">현재 예약이 없습니다.</p>
          ) : (
            data.currentReservations.map((reservation) => (
              <div
                key={reservation.reservationNumber}
                className="flex flex-col gap-5 rounded-xl border border-black p-10"
              >
                <p>예약번호: {reservation.reservationNumber}</p>
                <p>예약매장: {reservation.reservationStore}</p>
                <hr />
                <p>일정: {formatDateTime(reservation.reservationTime)}</p>
                <p>클래스 명: {reservation.className}</p>
                <div className="mt-5 flex h-[4.375rem] gap-3">
                  <Button
                    variant="secondaryDark"
                    label="변경"
                    className="w-full text-[26px]"
                    onClick={() =>
                      handleChangeClick(reservation.reservationNumber)
                    }
                  />
                  <Button
                    variant="secondaryDark"
                    label="취소"
                    className="w-full text-[26px]"
                    onClick={() =>
                      handleCancelClick(reservation.reservationNumber)
                    }
                  />
                </div>
              </div>
            ))
          )}
        </section>

        <section className="mb-[4rem] h-[9.375rem] border-b">
          <h2 className="hidden">디어오브제 공지</h2>
          <p className="text-sm">꼭 확인해주세요!</p>
          <span>디어오브제에서 전하는 공지</span>
        </section>

        {!!data?.pastReservations?.length && (
          <section className="flex flex-col gap-5">
            <h2 className="text-xl">지난 예약</h2>
            {data.pastReservations.slice(0, 1).map((reservation) => (
              <div
                key={reservation.reservationNumber}
                className="flex flex-col gap-5 rounded-xl border border-black p-10"
              >
                <p>예약번호: {reservation.reservationNumber}</p>
                <p>예약매장: {reservation.reservationStore}</p>
                <hr />
                <p>일정: {formatDateTime(reservation.reservationTime)}</p>
                <p>클래스 명: {reservation.className}</p>
              </div>
            ))}
          </section>
        )}
      </div>
    </MyPageLayout>
  );
};
