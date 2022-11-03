import React, {
  memo,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import Button from '../../../components/button';
import { EVENTS, MAX_PASSWORD_LENGTH } from '../../../configuration';
import Input from '../../../components/input';
import ModalWrap from '../../../components/modal-wrap';
import { type Response, SocketContext } from '../../../contexts/socket.context';

interface ChangePasswordModalProps {
  toggleModal: () => void;
}

function ChangePasswordModal(props: ChangePasswordModalProps): React.ReactElement {
  const { toggleModal } = props;

  const connection = useContext(SocketContext);

  const [confirmNewPassword, setConfirmNewPassword] = useState<string>('');
  const [formError, setFormError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [newPassword, setNewPassword] = useState<string>('');
  const [oldPassword, setOldPassword] = useState<string>('');

  const handleInput = (
    event: React.FormEvent<HTMLInputElement>,
  ): void => {
    const { currentTarget: { name = '', value = '' } = {} } = event;
    setFormError('');
    if (name === 'confirmNewPassword') {
      return setConfirmNewPassword((state: string): string => {
        if (state.length <= MAX_PASSWORD_LENGTH) {
          return value;
        }
        return state;
      });
    }
    if (name === 'newPassword') {
      return setNewPassword((state: string): string => {
        if (state.length <= MAX_PASSWORD_LENGTH) {
          return value;
        }
        return state;
      });
    }
    return setOldPassword(value);
  };

  const handleResponse = (): void => {

  };

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
      event.preventDefault();

      setLoading(true);
    },
    [
      confirmNewPassword,
      newPassword,
      oldPassword,
    ],
  );

  useEffect(
    (): (() => void) => {
      connection.on(EVENTS.COMPLETE_LOGOUT, handleResponse);

      return (): void => {
        connection.off(EVENTS.COMPLETE_LOGOUT, handleResponse);
      };
    },
    [connection],
  );

  return (
    <ModalWrap>
      <form
        className="flex direction-column"
        onSubmit={handleSubmit}
      >
        <h1>
          Change password
        </h1>
        <Input
          classes={['mt-1']}
          disabled={loading}
          handleInput={handleInput}
          name="oldPassword"
          placeholder="Your current password"
          type="password"
          value={oldPassword}
        />
        <Input
          classes={['mt-1']}
          disabled={loading}
          handleInput={handleInput}
          name="newPassword"
          placeholder="New password"
          type="password"
          value={newPassword}
        />
        <Input
          classes={['mt-1']}
          disabled={loading}
          handleInput={handleInput}
          name="confirmNewPassword"
          placeholder="Confirm new password"
          type="password"
          value={confirmNewPassword}
        />
        <div className="flex align-items-center justify-center auth-error noselect">
          { formError && (
            <span className="fade-in">
              { formError }
            </span>
          ) }
        </div>
        <Button
          disabled={loading}
          isSubmit
        >
          Submit
        </Button>
        <Button
          disabled={loading}
          classes={['mt-1']}
          handleClick={toggleModal}
        >
          Cancel
        </Button>
      </form>
    </ModalWrap>
  );
}

export default memo(ChangePasswordModal);
