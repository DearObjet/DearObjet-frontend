import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { AgreementKey, UserType } from '../types/signup-types';
import { TERMS } from '../constants/signup-constants';

interface SetAgreementPayload {
  key: AgreementKey;
  isChecked: boolean;
}

interface SignupState {
  userType: UserType;
  openTerms: Record<AgreementKey, boolean>;
  agreements: Record<AgreementKey, boolean>;
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
