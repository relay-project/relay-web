import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { DeviceModel } from '../../types/models';

export interface ConnectedDevicesState {
  connectedDevices: DeviceModel[];
  dataLoaded: boolean;
  isLoading: boolean;
}

const initialState: ConnectedDevicesState = {
  connectedDevices: [],
  dataLoaded: false,
  isLoading: false,
};

export const connectedDevicesSlice = createSlice({
  initialState,
  name: 'connectedDevices',
  reducers: {
    addDevice: (state, action: PayloadAction<DeviceModel>): ConnectedDevicesState => {
      if (state.connectedDevices.length === 0) {
        return {
          ...state,
          connectedDevices: [action.payload],
        };
      }
      const deviceIds = state.connectedDevices.map(
        (device: DeviceModel): string => device.deviceId,
      );
      if (deviceIds.includes(action.payload.deviceId)) {
        return state;
      }
      return {
        ...state,
        connectedDevices: [
          ...state.connectedDevices,
          action.payload,
        ],
      };
    },
    deleteAllDevices: (state): ConnectedDevicesState => ({
      ...state,
      connectedDevices: [],
    }),
    deleteDevice: (
      state,
      action: PayloadAction<string>,
    ): ConnectedDevicesState => ({
      ...state,
      connectedDevices: state.connectedDevices.filter(
        (device: DeviceModel): boolean => device.deviceId !== action.payload,
      ),
    }),
    setConnectedDevices: (
      _,
      action: PayloadAction<ConnectedDevicesState>,
    ): ConnectedDevicesState => ({
      ...action.payload,
    }),
    setDataLoaded: (state, action: PayloadAction<boolean>): ConnectedDevicesState => ({
      ...state,
      dataLoaded: action.payload,
    }),
    setIsLoading: (state, action: PayloadAction<boolean>): ConnectedDevicesState => ({
      ...state,
      isLoading: action.payload,
    }),
  },
});

export const {
  addDevice,
  deleteAllDevices,
  deleteDevice,
  setConnectedDevices,
  setDataLoaded,
  setIsLoading,
} = connectedDevicesSlice.actions;

export default connectedDevicesSlice.reducer;
