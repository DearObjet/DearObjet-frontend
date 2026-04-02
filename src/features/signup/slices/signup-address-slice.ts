import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface AddressState {
  zipcode: string;
  roadAddress: string;
  detailAddress: string;
}

const initialState: AddressState = {
  zipcode: '',
  roadAddress: '',
  detailAddress: '',
};

const addressSlice = createSlice({
  name: 'address',
  initialState,
  reducers: {
    setAddress: (
      state,
      action: PayloadAction<{ zipcode: string; roadAddress: string }>
    ) => {
      state.zipcode = action.payload.zipcode;
      state.roadAddress = action.payload.roadAddress;
    },
    setDetailAddress: (state, action: PayloadAction<string>) => {
      state.detailAddress = action.payload;
    },
  },
});

export const { setAddress, setDetailAddress } = addressSlice.actions;
export default addressSlice.reducer;
