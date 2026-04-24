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

// partner header
export const ROUTE_LABELS: Record<string, { main: string; sub?: string }> = {
  // shop
  '/shop/dashboard': { main: '관리홈', sub: '대시보드' },
  '/shop/manage': { main: '관리홈', sub: '나의 소품샵 관리' },
  '/shop/manage/reservations': { main: '관리홈', sub: '클래스 예약 관리' },

  '/shop/artists': { main: '입점관리', sub: '작가 리스트' },
  '/shop/inventory': { main: '입점관리', sub: '품목 및 재고관리' },
  '/shop/contracts': { main: '입점관리', sub: '계약서 관리' },

  '/shop/settlements': { main: '정산관리', sub: '정산금액 계산' },

  '/shop/messages': { main: '마이페이지', sub: '메세지' },
  '/shop/notices': { main: '공지사항' },
  '/shop/profile': { main: '개인정보' },
  '/shop/settings': { main: '환경설정' },

  // artist
  '/artist/dashboard': { main: '관리홈', sub: '대시보드' },

  '/artist/inventory': { main: '입점관리', sub: '품목 및 재고관리' },
  '/artist/shops': { main: '입점관리', sub: '입점처 리스트' },
  '/artist/shipments': { main: '입점관리', sub: '출고관리' },

  '/artist/settlements': { main: '정산관리', sub: '정산관리' },

  '/artist/messages': { main: '마이페이지', sub: '메세지' },
  '/artist/notices': { main: '공지사항' },
  '/artist/profile': { main: '개인정보' },
  '/artist/settings': { main: '환경설정' },
};
