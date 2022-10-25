import React, { memo, useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { v4 } from 'uuid';

import { connection, SocketContext } from './contexts/socket.context';
import delay from './utilities/delay';
import { EVENTS } from './configuration';
import router from './router';
import { showSpinner } from './store/features/spinner.slice';
import Spinner from './components/spinner';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { setDeviceId } from './store/features/device.slice';

function App(): React.ReactElement {
  const dispatch = useAppDispatch();

  const { deviceId } = useAppSelector((state) => state.device);
  const isLoading = useAppSelector((state) => state.spinner.isLoading);

  useEffect(
    (): void => {
      if (!deviceId) {
        dispatch(setDeviceId(v4()));
      }

      // TODO: set device name

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
