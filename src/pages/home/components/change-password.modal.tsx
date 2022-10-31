import React, { memo } from 'react';

import Button from '../../../components/button';
import Input from '../../../components/input';
import ModalWrap from '../../../components/modal-wrap';

interface ChangePasswordModalProps {
  confirmNewPassword: string;
  closeModal: () => void;
  handleInput: (event: React.FormEvent<HTMLInputElement>) => void;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => Promise<void>;
  newPassword: string;
  oldPassword: string;
}

function ChangePasswordModal(props: ChangePasswordModalProps): React.ReactElement {
  const {
    closeModal,
    confirmNewPassword,
    handleInput,
    handleSubmit,
    newPassword,
    oldPassword,
  } = props;

  return (
    <ModalWrap>
      <form
        className="flex direction-column"
        onSubmit={handleSubmit}
      >
        <h1>
          Modal
        </h1>
        <Input
          handleInput={handleInput}
          name="Your current password"
          type="password"
          value={oldPassword}
        />
        <Input
          handleInput={handleInput}
          name="New password"
          type="password"
          value={newPassword}
        />
        <Input
          handleInput={handleInput}
          name="Confirm new password"
          type="password"
          value={confirmNewPassword}
        />
        <Button handleClick={closeModal}>
          Cancel
        </Button>
        <Button isSubmit>
          Submit
        </Button>
      </form>
    </ModalWrap>
  );
}

export default memo(ChangePasswordModal);
