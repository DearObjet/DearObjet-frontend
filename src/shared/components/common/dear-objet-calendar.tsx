import { useEffect, useRef, useState } from 'react';
import Calendar from 'react-calendar';

import ArrowDown from '../../../assets/arrow-down.svg';
import '../../styles/react-calendar.css';

interface DropdownProps {
  size: 'medium' | 'large';
  value: number;
  options: { value: number; label: string }[];
  onChange: (value: number) => void;
}

const Dropdown = ({ size, value, options, onChange }: DropdownProps) => {
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
        className={`flex items-center px-2.5 ${options.length === 10 ? 'gap-2.5' : 'gap-4'} ${size === 'medium' ? 'text-sm' : 'text-base'} font-medium text-theme-900 outline-none`}
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
                className={`w-full px-2 py-2 text-left ${size === 'medium' ? 'text-sm' : 'text-base'} hover:bg-theme-100 ${
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

interface DearObjetCalendarProps {
  value: Date | null;
  onChange: (date: Date) => void;
  minDate?: Date;
  color: 'white' | 'gray';
  size: 'medium' | 'large';
}

interface CalendarNavigationProps {
  activeDate: Date;
  onChange: (date: Date) => void;
  size: 'medium' | 'large';
}

const CalendarNavigation = ({
  size,
  activeDate,
  onChange,
}: CalendarNavigationProps) => {
  const currentYear = new Date().getFullYear();

  const yearOptions = Array.from({ length: 10 }, (_, i) => ({
    value: currentYear + i,
    label: `${currentYear + i}`,
  }));

  const monthOptions = Array.from({ length: 12 }, (_, i) => ({
    value: i + 1,
    label: `${i + 1}월`,
  }));

  return (
    <div
      className={`flex items-center gap-5 px-2 ${size === 'medium' ? 'py-3' : 'py-5'}`}
    >
      <Dropdown
        size={size}
        value={activeDate.getFullYear()}
        options={yearOptions}
        onChange={(year) => {
          const newDate = new Date(activeDate);
          newDate.setFullYear(year);
          onChange(newDate);
        }}
      />
      <Dropdown
        size={size}
        value={activeDate.getMonth() + 1}
        options={monthOptions}
        onChange={(month) => {
          const newDate = new Date(activeDate);
          newDate.setMonth(month - 1);
          onChange(newDate);
        }}
      />
    </div>
  );
};

export const DearObjetCalendar = ({
  value,
  onChange,
  minDate,
  color,
  size,
}: DearObjetCalendarProps) => {
  const [activeDate, setActiveDate] = useState(new Date());

  return (
    <div className="w-full">
      <CalendarNavigation
        size={size}
        activeDate={activeDate}
        onChange={setActiveDate}
      />
      <Calendar
        className={`${color} ${size}`}
        onChange={(date) => onChange(date as Date)}
        value={value}
        activeStartDate={activeDate}
        onActiveStartDateChange={({ activeStartDate }) => {
          if (activeStartDate) setActiveDate(activeStartDate);
        }}
        calendarType="gregory"
        locale="ko-KR"
        minDate={minDate ?? new Date()}
        formatShortWeekday={(_, date) =>
          ['S', 'M', 'T', 'W', 'T', 'F', 'S'][date.getDay()]
        }
        formatDay={(_, date) => String(date.getDate())}
      />
    </div>
  );
};
