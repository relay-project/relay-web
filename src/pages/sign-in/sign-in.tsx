import React, {
  memo,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useNavigate } from 'react-router-dom';

import delay from '../../utilities/delay';
import {
  ERROR_MESSAGES,
  EVENTS,
  RESPONSE_MESSAGES,
} from '../../configuration';
import formatErrorDetails from '../../utilities/format-error-details';
import { type Response, SocketContext } from '../../contexts/socket.context';
import { ROUTING } from '../../router';
import { setUserData } from '../../store/features/user.slice';
import SignInLayout from './components/sign-in.layout';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import useRedirect from '../../hooks/use-redirect';

interface SignInPayload {
  token: string;
  user: {
    id: number;
    login: string;
    role: string;
  };
}

function SignIn(): React.ReactElement {
  useRedirect(true);

  const connection = useContext(SocketContext);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [formError, setFormError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [login, setLogin] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showAccountSuspendedModal, setShowAccountSuspendedModal] = useState<boolean>(false);

  const { deviceId, deviceName } = useAppSelector((state) => state.device);

  const handleInput = (event: React.FormEvent<HTMLInputElement>): void => {
    const { currentTarget: { name = '', value = '' } = {} } = event;
    setFormError('');
    if (name === 'login') {
      return setLogin(value);
    }
    return setPassword(value);
  };

  const handleNavigate = (destination: string): void => {
    if (destination === 'back') {
      return navigate(-1);
    }
    return navigate(destination);
  };

  const handleResponse = (response: Response<SignInPayload>): void => {
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
      if (response.status === 401) {
        return setFormError(ERROR_MESSAGES.accessDenied);
      }
      if (response.status === 403) {
        setFormError(ERROR_MESSAGES.accountSuspended);
        return setShowAccountSuspendedModal(true);
      }
      return setFormError(ERROR_MESSAGES.generic);
    }

    if (!response.payload) {
      return setFormError(ERROR_MESSAGES.generic);
    }

    const { token, user } = response.payload;
    dispatch(setUserData({
      token,
      ...user,
    }));

    return navigate(
      `/${ROUTING.home}`,
      {
        replace: true,
      },
    );
  };

  const handleSubmit = useCallback(
    async (
      event: React.FormEvent<HTMLFormElement>,
    ): Promise<typeof connection | void> => {
      event.preventDefault();

      const trimmedLogin = (login || '').trim();
      const trimmedPassword = (password || '').trim();
      if (!(trimmedLogin && trimmedPassword)) {
        return setFormError(ERROR_MESSAGES.pleaseProvideTheData);
      }

      setLoading(true);
      await delay();

      return connection.emit(
        EVENTS.SIGN_IN,
        {
          deviceId,
          deviceName,
          login: trimmedLogin,
          password: trimmedPassword,
        },
      );
    },
    [
      login,
      password,
    ],
  );

  useEffect(
    (): (() => void) => {
      connection.on(EVENTS.SIGN_IN, handleResponse);

      return (): void => {
        connection.off(EVENTS.SIGN_IN, handleResponse);
      };
    },
    [connection],
  );

  return (
    <SignInLayout
      closeModal={(): void => setShowAccountSuspendedModal(false)}
      formError={formError}
      handleInput={handleInput}
      handleNavigate={handleNavigate}
      handleSubmit={handleSubmit}
      loading={loading}
      login={login}
      password={password}
      showAccountSuspendedModal={showAccountSuspendedModal}
    />
  );
}

export default memo(SignIn);
