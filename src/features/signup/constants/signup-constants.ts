import type {
  BusinessCategory,
  BusinessType,
  Specialty,
  TermItem,
  UserType,
} from '../types/signup-types';

export const SIGNUP_ENDPOINTS = {
  COMPLETE_SIGNUP: '/users/complete',
  COMPLETE_SHOP_SIGNUP: '/users/complete/shop',
  COMPLETE_ARTIST_SIGNUP: '/users/complete/artist',
  COMPLETE_PHONE_VERIFICATION: '/auth/phone-verifications/send',
  COMPLETE_VERIFY_PHONE: '/auth/phone-verifications/verify',
} as const;

export const USER_TYPES: { value: UserType; label: string }[] = [
  { value: '일반회원', label: '일반회원' },
  { value: '작가', label: '작가' },
  { value: '소품샵', label: '소품샵' },
];

export const TERMS: TermItem[] = [
  {
    key: 'age',
    label: '만 14세 이상입니다 (필수)',
    hasDetail: false,
    showForUserTypes: ['일반회원', '작가', '소품샵'],
  },
  {
    key: 'terms',
    label: '이용약관 (필수)',
    hasDetail: true,
    showForUserTypes: ['일반회원', '작가', '소품샵'],
  },
  {
    key: 'businessInfo',
    label: '사업자 정보 확인 및 등록 동의 (필수)',
    hasDetail: true,
    showForUserTypes: ['작가', '소품샵'],
  },
  {
    key: 'settlement',
    label: '정산 및 수수료 정책 동의 (필수)',
    hasDetail: false,
    showForUserTypes: ['작가', '소품샵'],
  },
  {
    key: 'fraud',
    label: '부정거래 방지 및 제재 정책 동의 (필수)',
    hasDetail: true,
    showForUserTypes: ['작가', '소품샵'],
  },
  {
    key: 'customerData',
    label: '고객 리뷰 및 데이터 활용 동의 (선택)',
    hasDetail: false,
    showForUserTypes: ['작가', '소품샵'],
  },
  {
    key: 'marketing',
    label: '개인정보 마케팅 활용동의 (선택)',
    hasDetail: true,
    showForUserTypes: ['일반회원', '작가', '소품샵'],
  },
  {
    key: 'notification',
    label: '이벤트, 쿠폰, 특가 알림 메일 및 sms 등 수신 (선택)',
    hasDetail: false,
    showForUserTypes: ['일반회원', '작가', '소품샵'],
  },
];

export const SUBMIT_BUTTON_LABELS: Record<UserType, string> = {
  일반회원: '회원가입하기',
  작가: '작가 등록 신청',
  소품샵: '소품샵 등록 신청',
};

export const BUSINESS_TYPE_OPTIONS: {
  value: BusinessType | '';
  label: string;
}[] = [
  { value: '', label: '' },
  { value: 'SERVICE', label: '서비스업' },
  { value: 'WHOLESALE_RETAIL', label: '도·소매업' },
];

export const BUSINESS_CATEGORY_OPTIONS: {
  value: BusinessCategory | '';
  label: string;
}[] = [
  { value: '', label: '' },
  { value: 'ONLINE_MARKETPLACE', label: '통신판매중개업' },
  { value: 'ECOMMERCE_PLATFORM', label: '전자상거래 플랫폼 운영업' },
  { value: 'ECOMMERCE_RETAIL', label: '전자상거래 소매업' },
  { value: 'GENERAL_RETAIL', label: '잡화 소매업' },
  { value: 'CRAFT_RETAIL', label: '공예품 소매업' },
];

export const SPECIALTY_OPTIONS: { value: Specialty | ''; label: string }[] = [
  { value: '', label: '' },
  { value: 'STATIONERY_PAPER', label: '문구·페이퍼 소품' },
  { value: 'INTERIOR_DECOR', label: '인테리어 소품' },
  { value: 'LIVING_GOODS', label: '리빙·생활잡화' },
  { value: 'DESK_OFFICE', label: '데스크·오피스 소품' },
  { value: 'EMOTIONAL_GOODS_GIFT', label: '감성 굿즈·기프트' },
  { value: 'HANDMADE_CRAFT', label: '핸드메이드·공예' },
  { value: 'ILLUSTRATION_ART_GOODS', label: '일러스트·아트굿즈' },
  { value: 'CERAMIC', label: '도자기·세라믹' },
  { value: 'FABRIC_TEXTILE', label: '패브릭·자수·텍스타일' },
  { value: 'ECO_UPCYCLE', label: '친환경·업사이클 소품' },
];
