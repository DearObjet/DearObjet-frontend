import { ROUTES } from './routes';

// header
export const NAV_ITEMS = [
  { label: '공지사항', to: ROUTES.NOTICES },
  { label: '지도', to: ROUTES.MAP },
  { label: '포스트', to: ROUTES.POSTS },
  { label: '작가', to: ROUTES.ARTISTS },
] as const;

// footer
export const INFO_LINKS = [
  { label: '회사소개', to: ROUTES.ABOUT, isBold: false },
  { label: '채용정보', to: ROUTES.CAREERS, isBold: false },
  { label: '이용약관', to: ROUTES.TERMS, isBold: false },
  { label: '개인정보처리방침', to: ROUTES.PRIVACY, isBold: true },
  { label: '공지사항', to: ROUTES.NOTICES, isBold: false },
] as const;

export const PARTNER_LINKS = [
  { label: '제휴/광고 문의', to: ROUTES.PARTNERSHIP, isBold: false },
  { label: '고객의 소리', to: ROUTES.FEEDBACK, isBold: false },
  {
    label: '파트너 개인정보 처리방침',
    to: ROUTES.PARTNER_PRIVACY,
    isBold: true,
  },
] as const;

// role
export const USER_ROLE = {
  TEMP: 'TEMP',
  CUSTOMER: 'CUSTOMER',
  ARTIST: 'ARTIST',
  SHOP: 'SHOP',
  ADMIN: 'ADMIN',
} as const;
