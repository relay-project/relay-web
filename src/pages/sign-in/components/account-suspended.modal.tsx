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
      <div className="flex direction-column justify-space-between modal noselect">
        <div className="modal-title text-center">
          Your account has been suspended!
        </div>
        <div className="modal-text text-center">
          Your account has been suspended due to a large amount of failed sign in attempts
        </div>
        <div className="flex align-items-center justify-space-between">
          <Button
            classes={['button-negative']}
            handleClick={closeModal}
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
