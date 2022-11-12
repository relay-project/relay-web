import React, { memo, useEffect } from 'react';
import cuid from 'cuid';
import { RouterProvider } from 'react-router-dom';

import { connection, SocketContext } from './contexts/socket.context';
import delay from './utilities/delay';
import { EVENTS } from './configuration';
import router from './router';
import { setDeviceId, setDeviceName } from './store/features/device.slice';
import { showSpinner } from './store/features/spinner.slice';
import Spinner from './components/spinner';
import { useAppDispatch, useAppSelector } from './store/hooks';

function App(): React.ReactElement {
  const dispatch = useAppDispatch();

  const { deviceId, deviceName } = useAppSelector((state) => state.device);
  const isLoading = useAppSelector((state) => state.spinner.isLoading);

  useEffect(
    (): void => {
      if (!deviceId) {
        const newDeviceId = cuid();
        dispatch(setDeviceId(newDeviceId));
        if (!deviceName) {
          dispatch(setDeviceName(newDeviceId));
        }
      }

      connection.open();

      connection.on(
        EVENTS.CONNECT,
        async (): Promise<void> => {
          await delay();
          dispatch(showSpinner(false));
        },
      );
    },
    [],
  );

  return (
    <SocketContext.Provider value={connection}>
      { isLoading && (
        <Spinner />
      ) }
      <RouterProvider router={router} />
    </SocketContext.Provider>
  );
}

export default memo(App);
