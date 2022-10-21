import React, {
  memo,
  useEffect,
  useState,
} from 'react';
import { connect, Socket } from 'socket.io-client';

import { BACKEND_URL, EVENTS } from './configuration';
import './App.css';

function App(): React.ReactElement {
  const [connection, setConnection] = useState<Socket>();

  useEffect(
    (): void => {
      const socket = connect(BACKEND_URL);
      setConnection(socket);
    },
    [],
  );

  useEffect(
    (): (() => void) => {
      if (connection) {
        connection.on(EVENTS.CONNECT, (): void => {
          console.log('connected', connection.id);
          connection.emit(
            EVENTS.SIGN_IN,
            {
              login: '',
              password: 'test',
            },
          );
        });
        connection.on(EVENTS.SIGN_IN, (payload) => console.log('sign in', payload));
      }

      return (): void => {
        if (connection) {
          connection.removeAllListeners();
          connection.disconnect();
        }
      };
    },
    [connection],
  );

  return (
    <div className="App">
      <h1>
        Relay project
      </h1>
    </div>
  );
}

export default memo(App);
