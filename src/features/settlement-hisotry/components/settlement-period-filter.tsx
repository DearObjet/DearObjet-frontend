import { useState } from 'react';

import { Button } from '../../../shared/components/ui';
import { DearObjetRangeCalendar } from '../../../shared/components/common/dear-objet-range-calendar';

import {
  PERIOD_PRESETS,
  getPresetRange,
} from '../constants/settlement-history-constants';
import type {
  PeriodPreset,
  SettlementPeriodFilterProps,
} from '../types/settlement-history-types';

const formatDate = (date: Date) =>
  date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

export const SettlementPeriodFilter = ({
  onSearch,
}: SettlementPeriodFilterProps) => {
  const [selectedPreset, setSelectedPreset] = useState<PeriodPreset | null>(
    null
  );
  const [isCustom, setIsCustom] = useState(false);
  const [calendarRange, setCalendarRange] = useState<[Date, Date] | null>(null);
  const [pendingStart, setPendingStart] = useState<Date | null>(null);

  const handlePresetChange = (preset: PeriodPreset) => {
    setSelectedPreset((prev) => (prev === preset ? null : preset));
    setIsCustom(false);
    setCalendarRange(null);
    setPendingStart(null);
  };

  const handleCustomToggle = () => {
    const next = !isCustom;
    setIsCustom(next);
    if (next) {
      setSelectedPreset(null);
      setCalendarRange(null);
      setPendingStart(null);
    }
  };

  const handleRangeChange = (range: [Date, Date]) => {
    setCalendarRange(range);
    setPendingStart(null);
  };

  const handlePartialSelect = (start: Date) => {
    setPendingStart(start);
    setCalendarRange(null);
  };

  const handleSearch = () => {
    if (isCustom) {
      onSearch(
        calendarRange
          ? { start: calendarRange[0], end: calendarRange[1] }
          : { start: null, end: null }
      );
      return;
    }
    if (selectedPreset) {
      onSearch(getPresetRange(selectedPreset));
      return;
    }
    onSearch({ start: null, end: null });
  };

  const presetPairs: [
    (typeof PERIOD_PRESETS)[number],
    (typeof PERIOD_PRESETS)[number],
  ][] = [
    [PERIOD_PRESETS[0], PERIOD_PRESETS[1]],
    [PERIOD_PRESETS[2], PERIOD_PRESETS[3]],
    [PERIOD_PRESETS[4], PERIOD_PRESETS[5]],
  ];

  const previewStart = calendarRange
    ? formatDate(calendarRange[0])
    : pendingStart
      ? formatDate(pendingStart)
      : '시작일';
  const previewEnd = calendarRange ? formatDate(calendarRange[1]) : '종료일';

  return (
    <section className="flex w-[25rem] shrink-0 flex-col gap-4 overflow-y-auto rounded-xl bg-white px-5 py-4">
      <h2 className="font-bold">기간 조회</h2>

      {/* 프리셋 체크박스 */}
      <div className="flex flex-col gap-2.5">
        {presetPairs.map(([left, right]) => (
          <div key={left.value} className="grid grid-cols-2">
            {[left, right].map((preset) => (
              <label
                key={preset.value}
                className="flex cursor-pointer items-center gap-2 text-sm text-gray-700"
              >
                <input
                  type="checkbox"
                  className="h-4 w-4 cursor-pointer appearance-none rounded border border-gray-300 checked:bg-gray-900"
                  checked={selectedPreset === preset.value}
                  onChange={() => handlePresetChange(preset.value)}
                />
                {preset.label}
              </label>
            ))}
          </div>
        ))}
      </div>

      {/* 직접 설정 */}
      <div className="border-t pt-3">
        <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-gray-700">
          <input
            type="checkbox"
            className="h-4 w-4 cursor-pointer appearance-none rounded border border-gray-300 checked:bg-gray-900"
            checked={isCustom}
            onChange={handleCustomToggle}
          />
          직접 설정
        </label>
      </div>

      {isCustom && (
        <div className="flex flex-col gap-2">
          {/* 선택 범위 미리보기 */}
          <div className="flex items-center justify-between rounded-lg bg-gray-100 px-3 py-2 text-xs text-gray-600">
            <span>{previewStart}</span>
            <span className="text-gray-600">~</span>
            <span>{previewEnd}</span>
          </div>

          <DearObjetRangeCalendar
            value={calendarRange}
            onChange={handleRangeChange}
            onPartialSelect={handlePartialSelect}
          />

          <Button
            variant="secondaryDark"
            className="mt-2 w-full py-2.5 text-sm"
            label="조회하기"
            onClick={handleSearch}
          />
        </div>
      )}
    </section>
  );
};
