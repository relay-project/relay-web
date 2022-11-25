import React, { memo } from 'react';

import Button from '../../../components/button';
import ChangePasswordModal from './change-password.modal';
import { CHAT_TYPES, COLORS, SPACER } from '../../../configuration';
import type {
  ChatListEntry,
  ChatUser,
} from '../../../store/features/chat-list.slice';
import { ROUTING } from '../../../router';
import UpdateRecoveryModal from './update-recovery.modal';
import CloseIcon from '../../../icons/close';

interface HomeLayoutProps {
  chats: ChatListEntry[];
  handleCompleteLogout: () => void;
  handleHideChat: (chatId: number) => void;
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
    handleCompleteLogout,
    handleHideChat,
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
        { chats.length > 0 && chats.map((chat: ChatListEntry): React.ReactNode => (
          <div
            className="flex mt-1 justify-space-between align-items-center"
            key={chat.id}
          >
            <div className="flex direction-column noselect">
              <div>
                <Button
                  handleClick={(): void => handleNavigation(`/${ROUTING.chat}/${chat.id}`)}
                  isLink
                >
                  { chat.type === CHAT_TYPES.private && `Chat with ${
                    chat.users.filter(
                      (user: ChatUser): boolean => userId !== user.id,
                    )[0].login
                  }` }
                  { chat.type === CHAT_TYPES.group
                    && (chat.name || `Chat with ${chat.users.length} users`) }
                </Button>
              </div>
              { chat.latestMessage && chat.latestMessage.length > 0 && (
                <div>
                  { `Last message by ${chat.latestMessage[0].authorId === userId
                    ? 'you'
                    : chat.latestMessage[0].authorLogin
                  }: ${chat.latestMessage[0].text} ${
                    chat.newMessages > 0 ? `(new messages: ${chat.newMessages})` : ''
                  }` }
                </div>
              ) }
              { !chat.latestMessage && (
                <div>
                  No messages yet!
                </div>
              ) }
            </div>
            <Button
              handleClick={(): void => handleHideChat(chat.id)}
              isLink
              styles={{
                height: SPACER + SPACER / 2,
              }}
              title="Hide this chat"
            >
              <CloseIcon
                color={COLORS.accent}
                height={SPACER + SPACER / 2}
                hoverColor={COLORS.accentLight}
                width={SPACER + SPACER / 2}
              />
            </Button>
          </div>
        )) }
      </div>
    </>
  );
}

export default memo(HomeLayout);
