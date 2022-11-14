import React, { memo } from 'react';

import Button from '../../../components/button';
import ChangePasswordModal from './change-password.modal';
import { CHAT_TYPES } from '../../../configuration';
import type { ChatListEntry, ChatUser } from '../home';
import { ROUTING } from '../../../router';
import UpdateRecoveryModal from './update-recovery.modal';

interface HomeLayoutProps {
  chats: ChatListEntry[];
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
        <div className="flex justify-space-between align-items-center">
          <h1>
            Home
          </h1>
          <Button
            handleClick={(): void => handleNavigation(`/${ROUTING.createChat}`)}
            isLink
          >
            Create new chat
          </Button>
        </div>
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
        { chats.length > 0 && chats.map((chat: ChatListEntry): React.ReactNode => (
          <div
            className="flex mt-1 justify-space-between"
            key={chat.id}
          >
            <div className="flex direction-column">
              { chat.type === CHAT_TYPES.private && (
                <span>
                  { `Chat with ${chat.users.filter(
                    (user: ChatUser): boolean => userId !== user.id,
                  )[0].login}` }
                </span>
              ) }
              { chat.type === CHAT_TYPES.group && (
                <span>
                  { chat.name || `Chat with ${chat.users.length} users` }
                </span>
              ) }
              { chat.latestMessage && chat.latestMessage.length > 0 && (
                <div>
                  { `Last message by ${chat.latestMessage[0].authorId === userId
                    ? 'you'
                    : chat.latestMessage[0].authorLogin
                  }: ${chat.latestMessage[0].text}` }
                </div>
              ) }
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
