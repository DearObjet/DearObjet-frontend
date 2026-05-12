import type {
  PeriodPreset,
  DateRange,
} from '../types/settlement-history-types';

export const PERIOD_PRESETS: { label: string; value: PeriodPreset }[] = [
  { label: '이번주', value: 'THIS_WEEK' },
  { label: '저번주', value: 'LAST_WEEK' },
  { label: '이번달', value: 'THIS_MONTH' },
  { label: '지난달', value: 'LAST_MONTH' },
  { label: '올해', value: 'THIS_YEAR' },
  { label: '지난해', value: 'LAST_YEAR' },
];

export const getPresetRange = (preset: PeriodPreset): DateRange => {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0=Sun
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

  const startOf = (d: Date) =>
    new Date(d.getFullYear(), d.getMonth(), d.getDate());

  switch (preset) {
    case 'THIS_WEEK': {
      const start = startOf(today);
      start.setDate(today.getDate() + mondayOffset);
      const end = new Date(start);
      end.setDate(start.getDate() + 6);
      return { start, end };
    }
    case 'LAST_WEEK': {
      const start = startOf(today);
      start.setDate(today.getDate() + mondayOffset - 7);
      const end = new Date(start);
      end.setDate(start.getDate() + 6);
      return { start, end };
    }
    case 'THIS_MONTH': {
      const start = new Date(today.getFullYear(), today.getMonth(), 1);
      const end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      return { start, end };
    }
    case 'LAST_MONTH': {
      const start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      const end = new Date(today.getFullYear(), today.getMonth(), 0);
      return { start, end };
    }
    case 'THIS_YEAR': {
      const start = new Date(today.getFullYear(), 0, 1);
      const end = new Date(today.getFullYear(), 11, 31);
      return { start, end };
    }
    case 'LAST_YEAR': {
      const start = new Date(today.getFullYear() - 1, 0, 1);
      const end = new Date(today.getFullYear() - 1, 11, 31);
      return { start, end };
    }
  }
};
