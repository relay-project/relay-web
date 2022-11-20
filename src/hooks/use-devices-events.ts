import { useContext, useEffect } from 'react';

import {
  addDevice,
  deleteDevice,
  setConnectedDevices,
  setIsLoading,
} from '../store/features/connected-devices.slice';
import { EVENTS } from '../configuration';
import type { DeviceModel } from '../types/models';
import { type Response, SocketContext } from '../contexts/socket.context';
import { useAppDispatch, useAppSelector } from '../store/hooks';

export default function useDevicesEvents(connected: boolean): void {
  const connection = useContext(SocketContext);
  const dispatch = useAppDispatch();

  const { dataLoaded, isLoading } = useAppSelector((state) => state.connectedDevices);
  const { token } = useAppSelector((state) => state.user);

  const handleGetConnectedDevicesResponse = (response: Response<DeviceModel[]>) => {
    if (response.status > 299) {
      // TODO: handle errors
      return null;
    }

    const { payload } = response;
    if (!payload) {
      return null;
    }

    return dispatch(setConnectedDevices({
      connectedDevices: payload,
      dataLoaded: true,
      isLoading: false,
    }));
  };

  const handleDeviceConnection = (data: DeviceModel, isOnline = true) => {
    if (isOnline) {
      return dispatch(addDevice(data));
    }
    return dispatch(deleteDevice(data.deviceId));
  };

  useEffect(
    (): (() => void) => {
      if (connected && token) {
        connection.on(EVENTS.DEVICE_CONNECTED, handleDeviceConnection);
        connection.on(
          EVENTS.DEVICE_DISCONNECTED,
          (data) => handleDeviceConnection(data, false),
        );
        connection.on(
          EVENTS.GET_CONNECTED_DEVICES,
          handleGetConnectedDevicesResponse,
        );

        if (!dataLoaded && !isLoading) {
          dispatch(setIsLoading(true));
          connection.emit(EVENTS.GET_CONNECTED_DEVICES, { token });
        }
      }

      return (): void => {
        connection.off(EVENTS.DEVICE_CONNECTED, handleDeviceConnection);
        connection.off(
          EVENTS.DEVICE_DISCONNECTED,
          (data) => handleDeviceConnection(data, false),
        );
        connection.off(
          EVENTS.GET_CONNECTED_DEVICES,
          handleGetConnectedDevicesResponse,
        );
      };
    },
    [
      connected,
      token,
    ],
  );
}
