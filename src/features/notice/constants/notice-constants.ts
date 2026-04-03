import type { NoticeApiItem } from '../types/notice-types';

export const NOTICE_ENDPOINTS = {
  NOTICES: '/api/v1/notices',
  NOTICE_DETAIL: (id: number) => `/api/v1/notices/${id}`,
} as const;

export const USER_CATEGORIES = [
  { label: '전체', value: null },
  { label: '주요공지', value: 'IMPORTANT' },
  { label: '일반', value: 'GENERAL' },
  { label: '축제', value: 'FESTIVAL' },
  { label: '문화공연', value: 'CULTURE_PERFORMANCE' },
  { label: '이벤트', value: 'EVENT' },
] as const;

export const ARTIST_SHOP_CATEGORIES = [
  { label: '전체', value: null },
  { label: '주요공지', value: 'IMPORTANT' },
  { label: '일반', value: 'GENERAL' },
] as const;

export const CATEGORY_LABEL: Record<NoticeApiItem['category'], string> = {
  IMPORTANT: '주요공지',
  GENERAL: '일반',
  FESTIVAL: '축제',
  CULTURE_PERFORMANCE: '문화공연',
  EVENT: '이벤트',
};

export const ITEMS_PER_PAGE = 10;
