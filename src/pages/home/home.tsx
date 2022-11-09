import React, {
  memo,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useNavigate } from 'react-router-dom';

import delay from '../../utilities/delay';
import { deleteUserData } from '../../store/features/user.slice';
import { EVENTS } from '../../configuration';
import HomeLayout from './components/home.layout';
import { SocketContext } from '../../contexts/socket.context';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import useRedirect from '../../hooks/use-redirect';

function Home(): React.ReactElement {
  useRedirect();

  const connection = useContext(SocketContext);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [showChangePasswordModal, setShowChangePasswordModal] = useState<boolean>(false);
  const [showUpdateRecoveryModal, setShowUpdateRecoveryModal] = useState<boolean>(false);
  const { token } = useAppSelector((state) => state.user);

  const handleCompleteLogout = async (): Promise<typeof connection> => {
    await delay();
    return connection.emit(
      EVENTS.COMPLETE_LOGOUT,
      {
        token,
      },
    );
  };

  const handleGetChats = (): void => {
    connection.emit(
      EVENTS.GET_CHATS,
      {
        token,
      },
    );
  };

  const handleFindUsers = (): void => {
    connection.emit(
      EVENTS.FIND_USERS,
      {
        limit: 1,
        search: 'tes',
        token,
      },
    );
  };

  const handleFindUsersResponse = (response: Response): void => {
    console.log(response);
  };

  const handleGetChatsResponse = (response: Response): void => {
    console.log(response);
  };

  const handleLogout = async (): Promise<void> => {
    dispatch(deleteUserData());
    await delay();
    return navigate('/');
  };

  const toggleModal = (name: string): void => {
    if (name === 'password') {
      return setShowChangePasswordModal((state: boolean): boolean => !state);
    }
    return setShowUpdateRecoveryModal((state: boolean): boolean => !state);
  };

  useEffect(
    (): (() => void) => {
      connection.on(EVENTS.COMPLETE_LOGOUT, handleLogout);
      connection.on(EVENTS.FIND_USERS, handleFindUsersResponse);
      connection.on(EVENTS.GET_CHATS, handleGetChatsResponse);

      return (): void => {
        connection.off(EVENTS.COMPLETE_LOGOUT, handleLogout);
        connection.off(EVENTS.FIND_USERS, handleFindUsersResponse);
        connection.off(EVENTS.GET_CHATS, handleGetChatsResponse);
      };
    },
    [connection],
  );

  return (
    <HomeLayout
      handleFindUsers={handleFindUsers}
      handleGetChats={handleGetChats}
      handleCompleteLogout={handleCompleteLogout}
      handleLogout={handleLogout}
      showChangePasswordModal={showChangePasswordModal}
      showUpdateRecoveryModal={showUpdateRecoveryModal}
      toggleModal={toggleModal}
      token={token}
    />
  );
}

export default memo(Home);
