import React, { memo, useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';

import { connection, SocketContext } from './contexts/socket.context';
import { EVENTS } from './configuration';
import router from './router';

function App(): React.ReactElement {
  useEffect(
    (): void => {
      connection.open();

      // TODO: show global loader, possibly move this
      connection.on(
        EVENTS.CONNECT,
        (): void => console.log('connected', connection.id),
      );
    },
    [],
  );

  return (
    <SocketContext.Provider value={connection}>
      <RouterProvider router={router} />
    </SocketContext.Provider>
  );
}

export default memo(App);
