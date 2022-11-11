import React, { memo } from 'react';
import { Socket } from 'socket.io-client';

import Button from '../../../components/button';
import { CHAT_TYPES } from '../../../configuration';
import { ROUTING } from '../../../router';
import type { ChatListEntry } from '../home';
import ChangePasswordModal from './change-password.modal';
import UpdateRecoveryModal from './update-recovery.modal';

interface HomeLayoutProps {
  chats: ChatListEntry[];
  handleCreateChat: () => Promise<Socket>;
  handleFindUsers: () => void;
  handleGetChats: () => void;
  handleCompleteLogout: () => void;
  handleLogout: () => void;
  handleNavigation: (destination: string) => void;
  toggleModal: (name: string) => void;
  showChangePasswordModal: boolean;
  showUpdateRecoveryModal: boolean;
  token: string;
  userId: number;
}

function HomeLayout(props: HomeLayoutProps): React.ReactElement {
  const {
    chats,
    handleCreateChat,
    handleFindUsers,
    handleGetChats,
    handleCompleteLogout,
    handleLogout,
    handleNavigation,
    showChangePasswordModal,
    showUpdateRecoveryModal,
    toggleModal,
    token,
    userId,
  } = props;

  return (
    <>
      { showChangePasswordModal && (
        <ChangePasswordModal
          toggleModal={(): void => toggleModal('password')}
          token={token}
        />
      ) }
      { showUpdateRecoveryModal && (
        <UpdateRecoveryModal
          toggleModal={(): void => toggleModal('recovery')}
          token={token}
        />
      ) }
      <div className="flex direction-column">
        <h1>
          Home
        </h1>
        <button
          className="mt-1"
          onClick={handleLogout}
          type="button"
        >
          Logout
        </button>
        <button
          className="mt-1"
          onClick={handleCompleteLogout}
          type="button"
        >
          Complete logout
        </button>
        <button
          className="mt-1"
          onClick={(): void => toggleModal('password')}
          type="button"
        >
          Change password
        </button>
        <button
          className="mt-1"
          onClick={(): void => toggleModal('recovery')}
          type="button"
        >
          Update recovery data
        </button>
        <button
          className="mt-1"
          onClick={handleGetChats}
          type="button"
        >
          Get chats
        </button>
        <button
          className="mt-1"
          onClick={handleFindUsers}
          type="button"
        >
          Find users
        </button>
        <button
          className="mt-1"
          onClick={handleCreateChat}
          type="button"
        >
          Create chat
        </button>
        { chats.length > 0 && chats.map((chat: ChatListEntry): React.ReactNode => (
          <div
            className="flex mt-1 justify-space-between"
            key={chat.id}
          >
            <div className="flex direction-column">
              { chat.type === CHAT_TYPES.private && (
                <span>
                  { `Chat with ${chat.users.filter(
                    (user): boolean => userId !== user.id,
                  )[0].login}` }
                </span>
              ) }
              <div>
                { `Last message by ${chat.latestMessage[0].authorId === userId
                  ? 'you'
                  : chat.latestMessage[0].authorLogin
                }: ${chat.latestMessage[0].text}` }
              </div>
            </div>
            <Button
              classes={['ml-1']}
              handleClick={(): void => handleNavigation(`/${ROUTING.chat}/${chat.id}`)}
              isLink
            >
              Open
            </Button>
          </div>
        )) }
      </div>
    </>
  );
}

export default memo(HomeLayout);
