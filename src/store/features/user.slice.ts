import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import { ROLES } from '../../configuration';

export interface UserState {
  id: null | number;
  login: string;
  role: string;
  token: string;
}

const initialState: UserState = {
  id: null,
  login: '',
  role: ROLES.user,
  token: '',
};

export const userSlice = createSlice({
  initialState,
  name: 'user',
  reducers: {
    deleteUserData: (): UserState => ({ ...initialState }),
    setToken: (state, action: PayloadAction<string>): UserState => ({
      ...state,
      token: action.payload,
    }),
    setUserData: (state, action: PayloadAction<UserState>): UserState => ({
      ...state,
      ...action.payload,
    }),
  },
});

export const {
  deleteUserData,
  setToken,
  setUserData,
} = userSlice.actions;

export default userSlice.reducer;
