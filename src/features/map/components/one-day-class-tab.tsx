import { useEffect, useRef, useState, type ChangeEvent } from 'react';

import { useAppSelector } from '../../../app/hooks';
import { Button } from '../../../shared/components/ui';
import { USER_ROLE } from '../../../shared/constants';

import {
  useGetClassListQuery,
  useGetAvailableSlotsQuery,
  useCreateReservationMutation,
} from '../api/one-day-class-api';
import type { ClassListItem } from '../types/one-day-class-types';
import { DearObjetCalendar } from '../../../shared/components/common';

interface OneDayClassTabProps {
  shopId: number;
  shopName: string;
}

const formatDate = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

export const OneDayClassTab = ({ shopId, shopName }: OneDayClassTabProps) => {
  const user = useAppSelector((state) => state.auth.user);
  const userName = user?.name ?? '';

  const [selectedClass, setSelectedClass] = useState<ClassListItem | null>(
    null
  );
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSessionId, setSelectedSessionId] = useState<number | null>(
    null
  );
  const [remainingCapacity, setRemainingCapacity] = useState<number>(0);
  const [guestCount, setGuestCount] = useState(1);
  const [memo, setMemo] = useState('');

  const classDetailRef = useRef<HTMLDivElement>(null);

  const { data: classList } = useGetClassListQuery(shopId);

  const { data: slotsData } = useGetAvailableSlotsQuery(
    {
      classId: selectedClass?.classId ?? 0,
      date: selectedDate ? formatDate(selectedDate) : '',
    },
    { skip: selectedClass === null || selectedDate === null }
  );

  const [createReservation] = useCreateReservationMutation();

  const handleClassClick = (item: ClassListItem) => {
    if (selectedClass?.classId === item.classId) return;

    setSelectedClass(item);
    setSelectedDate(null);
    setSelectedSessionId(null);
    setGuestCount(1);
    setMemo('');

    // 클래스 상세 영역으로 스크롤
    setTimeout(() => {
      classDetailRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }, 50);
  };

  const handleDateChange = (date: Date) => {
    if (selectedDate?.toDateString() === date.toDateString()) return;
    setSelectedDate(date);
    setSelectedSessionId(null);
  };

  const handleSlotClick = (
    sessionId: number,
    remainingCapacity: number | null
  ) => {
    setRemainingCapacity(remainingCapacity ?? 0);
    setSelectedSessionId(sessionId);
    setGuestCount(1);
  };

  const handleGuestCountChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    const max = selectedSessionId
      ? (remainingCapacity ?? selectedClass!.maxCapacity ?? Infinity)
      : (selectedClass!.maxCapacity ?? Infinity);

    if (value < 1) setGuestCount(1);
    else if (value > max) setGuestCount(max);
    else setGuestCount(value);
  };

  const handleReserve = async () => {
    if (!selectedSessionId) return;

    if (!user) {
      alert('로그인이 필요한 서비스입니다.');
      return;
    }
    if (user.role === USER_ROLE.TEMP) {
      alert('회원가입이 필요한 서비스입니다.');
      return;
    }

    try {
      const result = await createReservation({
        sessionId: selectedSessionId,
        guestCount,
        reservationName: userName,
        memo,
      }).unwrap();

      alert(`예약이 완료되었습니다. (예약번호: ${result.reservationId})`);

      setSelectedDate(null);
      setSelectedSessionId(null);
      setRemainingCapacity(0);
      setGuestCount(1);
      setMemo('');
    } catch (error: unknown) {
      const apiError = error as {
        data?: { data?: { code?: string; message?: string } };
      };

      const code = apiError?.data?.data?.code;
      const message = apiError?.data?.data?.message;

      if (code === 'CR001' && message) {
        alert(message);
        return;
      }

      alert('예약에 실패했습니다. 다시 시도해주세요.');
    }
  };

  useEffect(() => {
    setSelectedClass(null);
    setSelectedDate(null);
    setSelectedSessionId(null);
    setRemainingCapacity(0);
    setGuestCount(1);
    setMemo('');
  }, [shopId]);

  return (
    <div className="flex flex-col">
      {/* 클래스 목록 */}
      <div className="flex max-h-[24rem] flex-col divide-y divide-theme-200 overflow-y-auto [&::-webkit-scrollbar]:hidden">
        {classList?.items.map((item) => (
          <ClassListItemCard
            key={item.classId}
            item={item}
            isSelected={selectedClass?.classId === item.classId}
            onClick={() => handleClassClick(item)}
          />
        ))}
      </div>

      {/* 클래스 상세 + 예약 */}
      {selectedClass && (
        <div
          ref={classDetailRef}
          className="flex flex-col border-t-2 border-theme-300"
        >
          {/* 상호명 */}
          <div className="border-b border-theme-200 px-4 py-3">
            <span className="text-lg font-bold tracking-widest text-theme-900">
              {shopName}
            </span>
          </div>

          {/* 이미지 */}
          <div className="w-full overflow-hidden bg-theme-200">
            {selectedClass.firstImageUrl && (
              <img
                src={selectedClass.firstImageUrl}
                alt={selectedClass.className}
                className="h-full w-full object-cover"
              />
            )}
          </div>

          {/* 제목 + 설명 */}
          <div className="flex flex-col gap-3 px-4 py-4">
            <span className="font-bold text-theme-900">
              {selectedClass.className}
            </span>
            {selectedClass.classDescription && (
              <span className="text-theme-700">
                {selectedClass.classDescription}
              </span>
            )}
          </div>

          <hr className="border-theme-200" />

          {/* 달력 */}
          <div className="flex justify-center px-4 py-4">
            <DearObjetCalendar
              value={selectedDate}
              onChange={handleDateChange}
              color={'gray'}
              size={'medium'}
            />
          </div>

          <hr className="border-theme-200" />

          {/* 시간 선택 + 예약 인원 + 메모 */}
          <div className="flex min-h-[23rem] flex-col gap-4 p-4">
            {selectedDate ? (
              slotsData?.slots.length ? (
                <>
                  <div className="grid grid-cols-4 gap-2">
                    {slotsData.slots.map((slot) => (
                      <button
                        key={slot.sessionId}
                        onClick={() =>
                          slot.available &&
                          handleSlotClick(
                            slot.sessionId,
                            slot.remainingCapacity
                          )
                        }
                        disabled={!slot.available}
                        className={`flex h-10 items-center justify-center rounded border text-base transition-colors ${
                          selectedSessionId === slot.sessionId
                            ? 'border-theme-900 bg-theme-900 text-white'
                            : slot.available
                              ? 'border-theme-300 text-theme-700 hover:border-theme-900 hover:bg-theme-200'
                              : 'cursor-not-allowed border-theme-200 bg-theme-100 text-theme-300'
                        }`}
                      >
                        {slot.time}
                      </button>
                    ))}
                  </div>

                  <hr className="border-theme-200" />

                  {/* 예약 인원 */}
                  <div className="flex items-center justify-between">
                    <span className="text-theme-900">예약 인원</span>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={guestCount}
                        min={1}
                        max={
                          selectedSessionId
                            ? (remainingCapacity ??
                              selectedClass.maxCapacity ??
                              undefined)
                            : (selectedClass.maxCapacity ?? undefined)
                        }
                        onChange={handleGuestCountChange}
                        className="w-[3.75rem] rounded border border-theme-300 p-1 text-center text-theme-900 outline-none [appearance:textfield] focus:border-theme-700 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                      />
                      <span className="text-theme-500">
                        최대{' '}
                        {selectedSessionId
                          ? (remainingCapacity ??
                            selectedClass.maxCapacity ??
                            '-')
                          : (selectedClass.maxCapacity ?? '-')}
                        명
                      </span>
                    </div>
                  </div>

                  <hr className="border-theme-200" />

                  {/* 메모 */}
                  <textarea
                    value={memo}
                    onChange={(e) => setMemo(e.target.value)}
                    placeholder="요구사항을 입력해주세요. (최대 250자)"
                    maxLength={250}
                    className="block w-full resize-none rounded border border-theme-300 p-3 text-theme-900 outline-none placeholder:text-theme-300 focus:border-theme-700"
                  />
                </>
              ) : (
                <p className="flex items-center justify-center text-center text-theme-300">
                  예약 가능한 시간이 없습니다.
                </p>
              )
            ) : (
              <p className="flex items-center justify-center text-center text-theme-300">
                날짜를 선택해주세요.
              </p>
            )}
          </div>

          <hr className="border-theme-200" />

          {/* 안내 멘트 */}
          {selectedClass.notes && (
            <>
              <div className="px-4 py-4">
                <p className="text-theme-700">{selectedClass.notes}</p>
              </div>
              <hr className="border-theme-200" />
            </>
          )}

          {/* 예약하기 버튼 */}
          <div className="px-4 py-4">
            <Button
              label="예약하기"
              variant="secondaryDark"
              size="medium"
              className="w-full"
              disabled={!selectedDate || !selectedSessionId}
              onClick={handleReserve}
            />
          </div>
        </div>
      )}
    </div>
  );
};

interface ClassListItemCardProps {
  item: ClassListItem;
  isSelected: boolean;
  onClick: () => void;
}

const ClassListItemCard = ({
  item,
  isSelected,
  onClick,
}: ClassListItemCardProps) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-start gap-3 p-4 text-left transition-colors hover:bg-theme-100 ${
        isSelected ? 'bg-theme-200 hover:bg-theme-200' : 'bg-white'
      }`}
    >
      <div className="flex flex-1 flex-col gap-3">
        <span className="font-bold text-theme-900">{item.className}</span>
        {item.maxCapacity && (
          <span className="text-sm text-theme-500">
            최대 {item.maxCapacity}명
          </span>
        )}
        <span className="line-clamp-3 text-sm text-theme-700">
          {item.classDescription}
        </span>
      </div>

      <div className="h-[95px] w-[95px] shrink-0 overflow-hidden rounded bg-theme-200">
        {item.firstImageUrl && (
          <img
            src={item.firstImageUrl}
            alt={item.className}
            className="h-full w-full object-cover"
          />
        )}
      </div>
    </button>
  );
};
