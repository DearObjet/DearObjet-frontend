import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

type UserType = '일반회원' | '작가' | '소품샵';
type AgreementKey =
  | 'all'
  | 'age'
  | 'terms'
  | 'businessInfo'
  | 'settlement'
  | 'fraud'
  | 'customerData'
  | 'marketing'
  | 'notification';

interface SetAgreementPayload {
  key: AgreementKey;
  isChecked: boolean;
}

interface SignupState {
  userType: UserType;
  openTerms: Record<AgreementKey, boolean>;
  agreements: Record<AgreementKey, boolean>;
}

interface TermItem {
  key: AgreementKey;
  label: string;
  hasDetail: boolean;
  showForUserTypes: UserType[];
}

const initialOpenTerms: Record<AgreementKey, boolean> = {
  all: false,
  age: false,
  terms: false,
  businessInfo: false,
  settlement: false,
  fraud: false,
  customerData: false,
  marketing: false,
  notification: false,
};

export const initialState: SignupState = {
  userType: '일반회원',
  openTerms: { ...initialOpenTerms },
  agreements: { ...initialOpenTerms },
};

const TERMS: TermItem[] = [
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

export const signupSlice = createSlice({
  name: 'signup',
  initialState,
  reducers: {
    setUserType: (state, action: PayloadAction<UserType>) => {
      state.userType = action.payload;
      state.agreements = { ...initialOpenTerms };
      state.openTerms = { ...initialOpenTerms };
    },
    toggleTerm: (state, action: PayloadAction<AgreementKey>) => {
      state.openTerms[action.payload] = !state.openTerms[action.payload];
    },
    setAgreement: (state, action: PayloadAction<SetAgreementPayload>) => {
      const { key, isChecked } = action.payload;

      state.agreements[key] = isChecked;

      const visibleTermKeys = TERMS.filter((term) =>
        term.showForUserTypes.includes(state.userType)
      ).map((term) => term.key);

      state.agreements.all = visibleTermKeys.every((k) => state.agreements[k]);
    },
    setAllAgreements: (state, action: PayloadAction<boolean>) => {
      const visibleTermKeys = TERMS.filter((term) =>
        term.showForUserTypes.includes(state.userType)
      ).map((term) => term.key);

      state.agreements.all = action.payload;

      visibleTermKeys.forEach((key) => {
        state.agreements[key] = action.payload;
      });
    },
    resetSignup: () => initialState,
  },
});

export const {
  setUserType,
  toggleTerm,
  setAgreement,
  setAllAgreements,
  resetSignup,
} = signupSlice.actions;

export default signupSlice.reducer;
