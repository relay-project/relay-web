import React, {
  memo,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import Button from '../../../components/button';
import delay from '../../../utilities/delay';
import {
  ERROR_MESSAGES,
  EVENTS,
  MAX_PASSWORD_LENGTH,
  MIN_PASSWORD_LENGTH,
  RESPONSE_MESSAGES,
} from '../../../configuration';
import formatErrorDetails from '../../../utilities/format-error-details';
import Input from '../../../components/input';
import ModalWrap from '../../../components/modal-wrap';
import { type Response, SocketContext } from '../../../contexts/socket.context';
import Spinner from '../../../components/spinner';
import { setToken } from '../../../store/features/user.slice';
import { useAppDispatch } from '../../../store/hooks';

interface ChangePasswordModalProps {
  toggleModal: () => void;
  token: string;
}

interface ChangePasswordResponse {
  token: string;
}

function ChangePasswordModal(props: ChangePasswordModalProps): React.ReactElement {
  const {
    toggleModal,
    token,
  } = props;

  const connection = useContext(SocketContext);
  const dispatch = useAppDispatch();

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

  const handleResponse = (response: Response<ChangePasswordResponse>): void => {
    setLoading(false);
    if (response.status > 299) {
      if (response.info === RESPONSE_MESSAGES.VALIDATION_ERROR
        && response.status === 400) {
        return setFormError(
          response.details
            ? formatErrorDetails(response.details)
            : ERROR_MESSAGES.providedDataIsInvalid,
        );
      }
      if (response.info === RESPONSE_MESSAGES.OLD_PASSWORD_IS_INVALID
        && response.status === 400) {
        return setFormError(ERROR_MESSAGES.currentPasswordIsInvalid);
      }
      return setFormError(ERROR_MESSAGES.generic);
    }

    if (!response.payload) {
      return setFormError(ERROR_MESSAGES.generic);
    }

    const { token: newToken } = response.payload;
    dispatch(setToken(newToken));

    return toggleModal();
  };

  const handleSubmit = useCallback(
    async (
      event: React.FormEvent<HTMLFormElement>,
    ): Promise<typeof connection | void> => {
      event.preventDefault();
      setFormError('');

      const trimmedConfirmNewPassword = (confirmNewPassword || '').trim();
      const trimmedNewPassword = (newPassword || '').trim();
      const trimmedOldPassword = (oldPassword || '').trim();
      if (!(trimmedConfirmNewPassword && trimmedNewPassword && trimmedOldPassword)) {
        return setFormError(ERROR_MESSAGES.pleaseProvideTheData);
      }
      if (trimmedNewPassword.length < MIN_PASSWORD_LENGTH) {
        return setFormError(ERROR_MESSAGES.passwordIsTooShort);
      }
      if (trimmedNewPassword.length > MAX_PASSWORD_LENGTH) {
        return setFormError(ERROR_MESSAGES.passwordIsTooLong);
      }
      if (trimmedConfirmNewPassword !== trimmedNewPassword) {
        return setFormError(ERROR_MESSAGES.passwordConfirmationIsInvalid);
      }

      setLoading(true);
      await delay();

      return connection.emit(
        EVENTS.UPDATE_PASSWORD,
        {
          newPassword: trimmedNewPassword,
          oldPassword: trimmedOldPassword,
          token,
        },
      );
    },
    [
      confirmNewPassword,
      newPassword,
      oldPassword,
    ],
  );

  useEffect(
    (): (() => void) => {
      connection.on(EVENTS.UPDATE_PASSWORD, handleResponse);

      return (): void => {
        connection.off(EVENTS.UPDATE_PASSWORD, handleResponse);
      };
    },
    [connection],
  );

  return (
    <ModalWrap>
      { loading && (
        <Spinner />
      ) }
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
          classes={['button-positive']}
          disabled={loading}
          isSubmit
        >
          Save
        </Button>
        <Button
          classes={['mt-1']}
          disabled={loading}
          handleClick={toggleModal}
        >
          Cancel
        </Button>
      </form>
    </ModalWrap>
  );
}

export default memo(ChangePasswordModal);
