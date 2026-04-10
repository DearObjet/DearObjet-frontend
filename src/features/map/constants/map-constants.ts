import type { BusinessHours } from '../types/map-types';

export const KAKAO_MAP_KEY = import.meta.env.VITE_KAKAO_MAP_KEY;

export const DAY_LABEL: Record<keyof BusinessHours, string> = {
  monday: '월요일',
  tuesday: '화요일',
  wednesday: '수요일',
  thursday: '목요일',
  friday: '금요일',
  saturday: '토요일',
  sunday: '일요일',
};

export const DAY_ORDER: (keyof BusinessHours)[] = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
];

export const TAB_MENUS = [
  '스토리',
  '원데이클래스',
  '입점작가',
  '정보',
  '인근놀거리',
] as const;
