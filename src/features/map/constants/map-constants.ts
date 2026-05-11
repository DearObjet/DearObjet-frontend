import type { BusinessHours, Coordinates } from '../types/map-types';

export const KAKAO_MAP_KEY = import.meta.env.VITE_KAKAO_MAP_KEY;

// 위치 기본값 (현재 위치 fallback으로 강남 구청 위치 저장)
export const DEFAULT_COORDINATES: Coordinates = {
  lat: 37.5172,
  lng: 127.0473,
};

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
  '리뷰',
  '인근놀거리',
] as const;
