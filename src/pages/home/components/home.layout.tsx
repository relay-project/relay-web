import React, { memo } from 'react';

import ChangePasswordModal from './change-password.modal';
import UpdateRecoveryModal from './update-recovery.modal';

interface HomeLayoutProps {
  handleFindUsers: () => void;
  handleGetChats: () => void;
  handleCompleteLogout: () => void;
  handleLogout: () => void;
  toggleModal: (name: string) => void;
  showChangePasswordModal: boolean;
  showUpdateRecoveryModal: boolean;
  token: string;
}

function HomeLayout(props: HomeLayoutProps): React.ReactElement {
  const {
    handleFindUsers,
    handleGetChats,
    handleCompleteLogout,
    handleLogout,
    showChangePasswordModal,
    showUpdateRecoveryModal,
    toggleModal,
    token,
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
      </div>
    </>
  );
}

export default memo(HomeLayout);
