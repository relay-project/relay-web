import React, {
  memo,
  useContext,
  useEffect,
} from 'react';
import { useNavigate } from 'react-router-dom';

import delay from '../../utilities/delay';
import { deleteUserData } from '../../store/features/user.slice';
import { EVENTS } from '../../configuration';
import HomeLayout from './components/home.layout';
import { SocketContext } from '../../contexts/socket.context';
import { useAppDispatch, useAppSelector } from '../../store/hooks';

function Home(): React.ReactElement {
  const connection = useContext(SocketContext);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { token } = useAppSelector((state) => state.user);

  useEffect(
    (): void => {
      if (!token) {
        navigate('/');
      }
    },
    [],
  );

  const handleCompleteLogout = async (): Promise<typeof connection> => {
    await delay();
    return connection.emit(
      EVENTS.COMPLETE_LOGOUT,
      {
        token,
      },
    );
  };

  const handleLogout = async (): Promise<void> => {
    dispatch(deleteUserData());
    await delay();
    return navigate('/');
  };

  useEffect(
    (): (() => void) => {
      connection.on(EVENTS.COMPLETE_LOGOUT, handleLogout);

      return (): void => {
        connection.off(EVENTS.COMPLETE_LOGOUT, handleLogout);
      };
    },
    [connection],
  );

  return (
    <HomeLayout
      handleCompleteLogout={handleCompleteLogout}
      handleLogout={handleLogout}
    />
  );
}

export default memo(Home);
