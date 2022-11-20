import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { DeviceModel } from '../../types/models';

export type DeviceState = Pick<DeviceModel, 'deviceId' | 'deviceName'>;

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
