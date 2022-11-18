import { useContext, useEffect } from 'react';

import { SocketContext } from '../contexts/socket.context';

export default function useEvents(connected: boolean, token = ''): void {
  const connection = useContext(SocketContext);

  useEffect(
    (): (() => void) => {
      console.log('there', connected, token, connection.connected);
      if (connected && token) {
        console.log(connection.id, 'CONNECTED');
      }

      return (): void => {
        console.log(connection.id, 'UNMOUNT');
      };
    },
    [connected],
  );
}
