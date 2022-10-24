import { connect, Socket } from 'socket.io-client';
import { createContext } from 'react';

import { BACKEND_URL } from '../configuration';

export interface Response<T = null> {
  datetime: number;
  details?: string;
  event: string;
  info: string;
  payload?: T;
  status: number;
}

export const connection: Socket = connect(
  BACKEND_URL,
  {
    autoConnect: false,
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 5000,
    reconnectionDelayMax: 10000,
  },
);

export const SocketContext = createContext<Socket>(connection);
