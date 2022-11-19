import React, {
  memo,
  useContext,
  useEffect,
} from 'react';
import cuid from 'cuid';
import { RouterProvider } from 'react-router-dom';

import delay from './utilities/delay';
import { EVENTS } from './configuration';
import router from './router';
import { setDeviceId, setDeviceName } from './store/features/device.slice';
import { showSpinner } from './store/features/spinner.slice';
import { SocketContext } from './contexts/socket.context';
import Spinner from './components/spinner';
import { useAppDispatch, useAppSelector } from './store/hooks';
import useChatListEvents from './hooks/use-chat-list-events';

function App(): React.ReactElement {
  const connection = useContext(SocketContext);
  const dispatch = useAppDispatch();

  const { deviceId, deviceName } = useAppSelector((state) => state.device);
  const isLoading = useAppSelector((state) => state.spinner.isLoading);

  useEffect(
    (): void => {
      const newDeviceId = cuid();
      if (!deviceId) {
        dispatch(setDeviceId(newDeviceId));
      }
      if (!deviceName) {
        dispatch(setDeviceName(newDeviceId));
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

  useChatListEvents(connection.connected);

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
