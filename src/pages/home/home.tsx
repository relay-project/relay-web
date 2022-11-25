import React, {
  memo,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useNavigate } from 'react-router-dom';

import type {
  MessageModel,
  UserModel,
} from '../../types/models';
import delay from '../../utilities/delay';
import { deleteChat } from '../../store/features/chat-list.slice';
import { deleteUserData } from '../../store/features/user.slice';
import { EVENTS } from '../../configuration';
import HomeLayout from './components/home.layout';
import { SocketContext } from '../../contexts/socket.context';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import useRedirect from '../../hooks/use-redirect';

export type ChatUser = Pick<UserModel, 'id' | 'login'>;

export type LatestMessage = Pick<MessageModel, 'authorId' | 'createdAt' | 'text'> & {
  authorLogin: string;
};

function Home(): React.ReactElement {
  useRedirect();

  const connection = useContext(SocketContext);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [showChangePasswordModal, setShowChangePasswordModal] = useState<boolean>(false);
  const [showUpdateRecoveryModal, setShowUpdateRecoveryModal] = useState<boolean>(false);

  const { chats } = useAppSelector((state) => state.chatList);
  const { id: userId, token } = useAppSelector((state) => state.user);

  const handleNavigation = (destination: string): void => navigate(destination);

  const handleCompleteLogout = async (): Promise<typeof connection> => {
    await delay();
    return connection.emit(
      EVENTS.COMPLETE_LOGOUT,
      {
        token,
      },
    );
  };

  const handleHideChat = (chatId: number) => {
    connection.emit(
      EVENTS.HIDE_CHAT,
      {
        chatId,
        token,
      },
    );
    // TODO: delete chat only after it is actually hidden
    return dispatch(deleteChat(chatId));
  };

  const handleLogout = async (): Promise<void> => {
    connection.emit(EVENTS.LOGOUT, { token });
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

      return (): void => {
        connection.off(EVENTS.COMPLETE_LOGOUT, handleLogout);
      };
    },
    [connection],
  );

  return (
    <HomeLayout
      chats={chats}
      handleCompleteLogout={handleCompleteLogout}
      handleHideChat={handleHideChat}
      handleLogout={handleLogout}
      handleNavigation={handleNavigation}
      showChangePasswordModal={showChangePasswordModal}
      showUpdateRecoveryModal={showUpdateRecoveryModal}
      toggleModal={toggleModal}
      token={token}
      userId={Number(userId)}
    />
  );
}

export default memo(Home);
