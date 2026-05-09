import { useState, useEffect, type ChangeEvent, useRef } from 'react';

import { Button } from '../../../../shared/components/ui';

import {
  useGetBusinessHoursQuery,
  useUpdateBusinessHoursMutation,
} from '../api/business-hours-api';
import type {
  BusinessHours,
  DayHours,
  DayKey,
} from '../types/business-hours-types';

const DAY_LABELS: { key: DayKey; label: string; full: string }[] = [
  { key: 'monday', label: '월', full: '월요일' },
  { key: 'tuesday', label: '화', full: '화요일' },
  { key: 'wednesday', label: '수', full: '수요일' },
  { key: 'thursday', label: '목', full: '목요일' },
  { key: 'friday', label: '금', full: '금요일' },
  { key: 'saturday', label: '토', full: '토요일' },
  { key: 'sunday', label: '일', full: '일요일' },
];

const EMPTY_HOURS: DayHours = { openTime: '', closeTime: '', isDayOff: false };

const DEFAULT_BUSINESS_HOURS: BusinessHours = {
  monday: { ...EMPTY_HOURS },
  tuesday: { ...EMPTY_HOURS },
  wednesday: { ...EMPTY_HOURS },
  thursday: { ...EMPTY_HOURS },
  friday: { ...EMPTY_HOURS },
  saturday: { ...EMPTY_HOURS },
  sunday: { ...EMPTY_HOURS },
};

export const RegisterBusinessHour = () => {
  const [selectedDay, setSelectedDay] = useState<DayKey | null>(null);
  const [businessHours, setBusinessHours] = useState<BusinessHours>(
    DEFAULT_BUSINESS_HOURS
  );
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const { data: businessHoursData } = useGetBusinessHoursQuery();
  console.log(businessHoursData);
  const [updateBusinessHours, { isLoading }] = useUpdateBusinessHoursMutation();

  useEffect(() => {
    if (!businessHoursData) return;
    const toHours = (day: {
      openTime: string | null;
      closeTime: string | null;
    }): DayHours => ({
      openTime: day.openTime ?? '',
      closeTime: day.closeTime ?? '',
      isDayOff: day.openTime === null && day.closeTime === null,
    });
    setBusinessHours({
      monday: toHours(businessHoursData.monday),
      tuesday: toHours(businessHoursData.tuesday),
      wednesday: toHours(businessHoursData.wednesday),
      thursday: toHours(businessHoursData.thursday),
      friday: toHours(businessHoursData.friday),
      saturday: toHours(businessHoursData.saturday),
      sunday: toHours(businessHoursData.sunday),
    });
  }, [businessHoursData]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        previewRef.current &&
        !previewRef.current.contains(e.target as Node)
      ) {
        setIsPreviewVisible(false);
      }
    };
    if (isPreviewVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isPreviewVisible]);

  const handleDaySelect = (day: DayKey) => {
    setSelectedDay(day);
  };

  const handleTimeChange = (
    type: 'openTime' | 'closeTime',
    e: ChangeEvent<HTMLInputElement>
  ) => {
    if (!selectedDay) return;
    setBusinessHours((prev) => ({
      ...prev,
      [selectedDay]: { ...prev[selectedDay], [type]: e.target.value },
    }));
  };

  const handleDayOffChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!selectedDay) return;
    const isDayOff = e.target.checked;
    setBusinessHours((prev) => ({
      ...prev,
      [selectedDay]: {
        ...prev[selectedDay],
        isDayOff,
      },
    }));
  };

  const handleSave = async () => {
    const requestBody = Object.fromEntries(
      Object.entries(businessHours).map(([day, hours]) => [
        day,
        {
          openTime: hours.isDayOff ? null : hours.openTime.trim() || null,
          closeTime: hours.isDayOff ? null : hours.closeTime.trim() || null,
        },
      ])
    ) as Record<DayKey, { openTime: string | null; closeTime: string | null }>;

    try {
      await updateBusinessHours(requestBody).unwrap();
      alert('운영 정보가 저장되었습니다.');
    } catch {
      alert('운영 정보 저장에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const currentHours = selectedDay ? businessHours[selectedDay] : null;

  return (
    <section className="flex flex-col rounded-xl bg-white px-[1.5rem] py-4">
      <div className="flex items-center justify-between border-b pb-3">
        <h3 className="font-bold">매장 운영 정보</h3>
        <div className="relative flex gap-1" ref={previewRef}>
          <Button
            variant="secondaryLight"
            className="flex items-center justify-center px-4 py-2 text-xs disabled:cursor-not-allowed disabled:opacity-40"
            label={isLoading ? '로딩 중...' : '확인'}
            disabled={isLoading}
            onClick={() => setIsPreviewVisible((prev) => !prev)}
          />

          {/* 운영시간 미리보기 모달 */}
          {isPreviewVisible && (
            <div className="absolute -right-40 -top-8 z-10 flex flex-col gap-2 rounded-lg border border-gray-200 bg-theme-100 p-3 shadow-md">
              {DAY_LABELS.map(({ key, full }) => {
                const hours = businessHours[key];
                const timeText =
                  hours.isDayOff || (!hours.openTime && !hours.closeTime)
                    ? '휴무'
                    : `${hours.openTime} ~ ${hours.closeTime}`;
                return (
                  <div key={key} className="flex text-xs text-gray-700">
                    <span className="w-[3.1rem] shrink-0">{full} :</span>
                    <span className="w-[4.7rem]">{timeText}</span>
                  </div>
                );
              })}
            </div>
          )}
          <Button
            variant="secondaryDark"
            className="flex items-center justify-center px-4 py-2 text-xs disabled:cursor-not-allowed disabled:opacity-40"
            label={isLoading ? '저장 중...' : '저장'}
            disabled={isLoading}
            onClick={handleSave}
          />
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-end gap-8">
        {/* 운영 요일 */}
        <div className="flex flex-col gap-6">
          <p className="text-sm font-medium">운영요일</p>
          <div className="flex gap-2">
            {DAY_LABELS.map(({ key, label }) => (
              <button
                key={key}
                className={`flex h-10 w-10 items-center justify-center rounded-md bg-theme-200 text-sm transition-colors ${
                  selectedDay === key
                    ? 'border-2 border-gray-800 font-semibold'
                    : 'border border-gray-300 text-theme-500 hover:border-gray-500'
                }`}
                onClick={() => handleDaySelect(key)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* 운영 시간 */}
        <div className="flex flex-col gap-6">
          <p className="text-sm font-medium">운영시간</p>
          {selectedDay === null ? (
            <p className="h-10 text-xs text-gray-500">
              요일을 먼저 선택해주세요.
            </p>
          ) : (
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="HH:MM"
                maxLength={5}
                className="h-10 w-[5.8rem] rounded-lg border border-gray-300 px-2 py-1.5 text-center text-sm disabled:cursor-not-allowed disabled:bg-theme-200 disabled:text-gray-300"
                disabled={selectedDay === null || !!currentHours?.isDayOff}
                value={currentHours?.openTime ?? ''}
                onChange={(e) => handleTimeChange('openTime', e)}
              />
              <span>&sim;</span>
              <input
                type="text"
                placeholder="HH:MM"
                maxLength={5}
                className="h-10 w-[5.8rem] rounded-lg border border-gray-300 px-2 py-1.5 text-center text-sm disabled:cursor-not-allowed disabled:bg-theme-200 disabled:text-gray-300"
                disabled={selectedDay === null || !!currentHours?.isDayOff}
                value={currentHours?.closeTime ?? ''}
                onChange={(e) => handleTimeChange('closeTime', e)}
              />
              {/* 휴무 체크박스 */}
              <label className="flex cursor-pointer items-center gap-1.5 text-sm text-gray-500">
                <input
                  type="checkbox"
                  className="h-4 w-4 cursor-pointer accent-gray-800"
                  checked={currentHours?.isDayOff ?? false}
                  onChange={handleDayOffChange}
                />
                휴무
              </label>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
