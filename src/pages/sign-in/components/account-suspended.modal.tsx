import React, { memo } from 'react';

import Button from '../../../components/button';
import ModalWrap from '../../../components/modal-wrap';
import { ROUTING } from '../../../router';
import '../styles.css';

interface AccountSuspendedModalProps {
  closeModal: () => void;
  handleNavigate: (destination: string) => void;
  login: string;
}

function AccountSuspendedModal(props: AccountSuspendedModalProps): React.ReactElement {
  const {
    closeModal,
    handleNavigate,
    login,
  } = props;

  return (
    <ModalWrap>
      <div className="flex direction-column justify-space-between modal">
        <div className="modal-title text-center">
          Your account has been suspended!
        </div>
        <div className="flex align-items-center justify-space-between">
          <Button
            handleClick={closeModal}
            isLink
          >
            Cancel
          </Button>
          <Button
            handleClick={(): void => handleNavigate(`/${ROUTING.recovery}/${login}`)}
          >
            Recovery
          </Button>
        </div>
      </div>
    </ModalWrap>
  );
}

export default memo(AccountSuspendedModal);
