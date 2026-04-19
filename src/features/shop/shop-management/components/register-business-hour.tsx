import { useState, type ChangeEvent } from 'react';

import { Button } from '../../../../shared/components/ui';

type DayKey =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';

type DayHours = {
  openTime: string;
  closeTime: string;
};

type BusinessHours = Record<DayKey, DayHours>;

const DAY_LABELS: { key: DayKey; label: string }[] = [
  { key: 'monday', label: '월' },
  { key: 'tuesday', label: '화' },
  { key: 'wednesday', label: '수' },
  { key: 'thursday', label: '목' },
  { key: 'friday', label: '금' },
  { key: 'saturday', label: '토' },
  { key: 'sunday', label: '일' },
];

const EMPTY_HOURS: DayHours = { openTime: '', closeTime: '' };

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

  const handleDaySelect = (day: DayKey) => {
    setSelectedDay(day);
  };

  const handleTimeChange = (
    type: keyof DayHours,
    e: ChangeEvent<HTMLInputElement>
  ) => {
    if (!selectedDay) return;
    setBusinessHours((prev) => ({
      ...prev,
      [selectedDay]: { ...prev[selectedDay], [type]: e.target.value },
    }));
  };

  const handleSave = () => {
    console.log('저장할 운영 정보:', businessHours);
    alert('운영 정보가 저장되었습니다.');
  };

  const currentHours = selectedDay ? businessHours[selectedDay] : null;

  return (
    <section className="flex flex-col rounded-xl bg-white px-[1.5rem] py-4">
      <div className="flex items-center justify-between border-b pb-3">
        <h3 className="font-bold">매장 운영 정보</h3>
        <Button
          variant="secondaryDark"
          className="flex items-center justify-center px-4 py-2 text-xs"
          label="저장"
          onClick={handleSave}
        />
      </div>

      <div className="mt-3 flex flex-wrap items-end gap-8">
        {/* 운영 요일 */}
        <div className="flex flex-col gap-3">
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
        <div className="flex flex-col gap-3">
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
                className="h-10 w-[5.8rem] rounded-lg border border-gray-300 px-2 py-1.5 text-center text-sm disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-300"
                disabled={selectedDay === null}
                value={currentHours?.openTime ?? ''}
                onChange={(e) => handleTimeChange('openTime', e)}
              />
              <span>&sim;</span>
              <input
                type="text"
                placeholder="HH:MM"
                maxLength={5}
                className="h-10 w-[5.8rem] rounded-lg border border-gray-300 px-2 py-1.5 text-center text-sm disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-300"
                disabled={selectedDay === null}
                value={currentHours?.closeTime ?? ''}
                onChange={(e) => handleTimeChange('closeTime', e)}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
