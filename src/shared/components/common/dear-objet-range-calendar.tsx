import { useEffect, useRef, useState } from 'react';
import Calendar from 'react-calendar';

import ArrowDown from '../../../assets/arrow-down.svg';
import '../../styles/react-range-calendar.css';

interface DropdownProps {
  value: number;
  options: { value: number; label: string }[];
  onChange: (value: number) => void;
}

const Dropdown = ({ value, options, onChange }: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const selectedLabel = options.find((o) => o.value === value)?.label;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2.5 px-2.5 text-sm font-medium text-theme-900 outline-none"
      >
        {selectedLabel}
        <img src={ArrowDown} alt="" aria-hidden="true" />
      </button>

      {isOpen && (
        <ul className="absolute left-0 top-full z-10 max-h-[12rem] overflow-y-auto rounded border border-theme-200 bg-white pr-4 shadow-md">
          {options.map((option) => (
            <li key={option.value}>
              <button
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full px-2 py-2 text-left text-sm hover:bg-theme-100 ${
                  option.value === value
                    ? 'font-medium text-theme-900'
                    : 'text-theme-700'
                }`}
              >
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

interface CalendarNavigationProps {
  activeDate: Date;
  onChange: (date: Date) => void;
}

const CalendarNavigation = ({
  activeDate,
  onChange,
}: CalendarNavigationProps) => {
  const currentYear = new Date().getFullYear();

  const yearOptions = Array.from({ length: 6 }, (_, i) => ({
    value: currentYear - 5 + i,
    label: `${currentYear - 5 + i}`,
  }));

  const monthOptions = Array.from({ length: 12 }, (_, i) => ({
    value: i + 1,
    label: `${i + 1}월`,
  }));

  return (
    <div className="flex items-center gap-5 px-2 py-3">
      <Dropdown
        value={activeDate.getFullYear()}
        options={yearOptions}
        onChange={(year) => {
          const next = new Date(activeDate);
          next.setFullYear(year);
          onChange(next);
        }}
      />
      <Dropdown
        value={activeDate.getMonth() + 1}
        options={monthOptions}
        onChange={(month) => {
          const next = new Date(activeDate);
          next.setMonth(month - 1);
          onChange(next);
        }}
      />
    </div>
  );
};

interface DearObjetRangeCalendarProps {
  value: [Date, Date] | null;
  onChange: (range: [Date, Date]) => void;
  onPartialSelect?: (start: Date) => void;
}

export const DearObjetRangeCalendar = ({
  value,
  onChange,
  onPartialSelect,
}: DearObjetRangeCalendarProps) => {
  const [activeDate, setActiveDate] = useState(new Date());

  return (
    <div className="w-full">
      <CalendarNavigation activeDate={activeDate} onChange={setActiveDate} />
      <Calendar
        className="react-calendar--range"
        selectRange
        allowPartialRange
        onChange={(val) => {
          if (!Array.isArray(val)) return;
          const [start, end] = val;
          if (start instanceof Date && end instanceof Date) {
            onChange([start, end]);
          } else if (start instanceof Date) {
            onPartialSelect?.(start);
          }
        }}
        value={value}
        activeStartDate={activeDate}
        onActiveStartDateChange={({ activeStartDate }) => {
          if (activeStartDate) setActiveDate(activeStartDate);
        }}
        calendarType="gregory"
        locale="ko-KR"
        formatShortWeekday={(_, date) =>
          ['S', 'M', 'T', 'W', 'T', 'F', 'S'][date.getDay()]
        }
        formatDay={(_, date) => String(date.getDate())}
      />
    </div>
  );
};
