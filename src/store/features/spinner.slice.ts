import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface SpinnerState {
  isLoading: boolean;
}

const initialState: SpinnerState = {
  isLoading: true,
};

export const spinnerSlice = createSlice({
  initialState,
  name: 'spinner',
  reducers: {
    showSpinner: (state, action: PayloadAction<boolean>): SpinnerState => ({
      ...state,
      isLoading: action.payload,
    }),
    toggleSpinner: (state): SpinnerState => ({
      isLoading: !state.isLoading,
    }),
  },
});

export const {
  showSpinner,
  toggleSpinner,
} = spinnerSlice.actions;

export default spinnerSlice.reducer;
