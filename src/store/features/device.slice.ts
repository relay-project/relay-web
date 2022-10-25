import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface DeviceState {
  deviceId: string;
  deviceName: string;
}

const initialState: DeviceState = {
  deviceId: '',
  deviceName: '',
};

export const deviceSlice = createSlice({
  initialState,
  name: 'device',
  reducers: {
    deleteDeviceData: (): DeviceState => ({ ...initialState }),
    setDeviceId: (state, action: PayloadAction<string>): DeviceState => ({
      ...state,
      deviceId: action.payload,
    }),
    setDeviceName: (state, action: PayloadAction<string>): DeviceState => ({
      ...state,
      deviceName: action.payload,
    }),
  },
});

export const {
  deleteDeviceData,
  setDeviceId,
  setDeviceName,
} = deviceSlice.actions;

export default deviceSlice.reducer;
