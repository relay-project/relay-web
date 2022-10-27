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
  EVENTS,
  MAX_LOGIN_LENGTH,
  MAX_RECOVERY_ANSWER_LENGTH,
  MAX_RECOVERY_QUESTION_LENGTH,
} from '../../configuration';
import { type Response, SocketContext } from '../../contexts/socket.context';
import { ROUTING } from '../../router';
import { setUserData } from '../../store/features/user.slice';
import SignUpLayout from './components/sign-up.layout';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import useRedirect from '../../hooks/use-redirect';

interface SignUpResponse {
  token: string;
  user: {
    id: number;
    login: string;
    role: string;
  };
}

function SignUp(): React.ReactElement {
  useRedirect(true);

  const connection = useContext(SocketContext);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const deviceData = useAppSelector((state) => state.device);
  const userData = useAppSelector((state) => state.user);

  useEffect(
    (): void => {
      if (userData.id && userData.token) {
        navigate(`/${ROUTING.home}`);
      }
    },
    [],
  );

  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [formError, setFormError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [login, setLogin] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [recoveryAnswer, setRecoveryAnswer] = useState<string>('');
  const [recoveryQuestion, setRecoveryQuestion] = useState<string>('');

  const handleResponse = (response: Response<SignUpResponse>): void => {
    setLoading(false);
    if (response.status !== 200) {
      // TODO: better error handling
      return setFormError(response.details || response.info);
    }

    if (!response.payload) {
      return setFormError('Something went wrong...');
    }

    const { token: tokenString, user } = response.payload;
    dispatch(setUserData({
      ...user,
      token: tokenString,
    }));

    return navigate(`/${ROUTING.home}`);
  };

  useEffect(
    (): (() => void) => {
      connection?.on(EVENTS.SIGN_UP, handleResponse);

      return (): void => {
        connection?.off(EVENTS.SIGN_UP, handleResponse);
      };
    },
    [connection],
  );

  const handleInput = (event: React.FormEvent<HTMLInputElement>): void => {
    const { currentTarget: { name = '', value = '' } = {} } = event;
    setFormError('');
    if (name === 'confirmPassword') {
      return setConfirmPassword(value);
    }
    if (name === 'login') {
      return setLogin((state: string): string => {
        if (state.length <= MAX_LOGIN_LENGTH) {
          return value;
        }
        return state;
      });
    }
    if (name === 'password') {
      return setPassword(value);
    }
    if (name === 'recoveryAnswer') {
      return setRecoveryAnswer((state: string): string => {
        if (state.length <= MAX_RECOVERY_ANSWER_LENGTH) {
          return value;
        }
        return state;
      });
    }
    return setRecoveryQuestion((state: string): string => {
      if (state.length <= MAX_RECOVERY_QUESTION_LENGTH) {
        return value;
      }
      return state;
    });
  };

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>): Promise<typeof connection | void> => {
      event.preventDefault();

      const trimmedLogin = (login || '').trim();
      const trimmedPassword = (password || '').trim();
      const trimmedRecoveryAnswer = (recoveryAnswer || '').trim();
      const trimmedRecoveryQuestion = (recoveryQuestion || '').trim();
      if (!(trimmedLogin && trimmedPassword
        && trimmedRecoveryAnswer && trimmedRecoveryQuestion)) {
        return setFormError('Please provide required data!');
      }

      setLoading(true);
      await delay();

      return connection.emit(
        EVENTS.SIGN_UP,
        {
          deviceId: deviceData.deviceId,
          deviceName: deviceData.deviceName || deviceData.deviceId, // TODO: fix
          login: trimmedLogin,
          password: trimmedPassword,
          recoveryAnswer: trimmedRecoveryAnswer,
          recoveryQuestion: trimmedRecoveryQuestion,
        },
      );
    },
    [
      deviceData,
      login,
      password,
      recoveryAnswer,
      recoveryQuestion,
    ],
  );

  const handleNavigate = (destination: string): void => {
    if (destination === 'back') {
      return navigate(-1);
    }
    return navigate(destination);
  };

  return (
    <SignUpLayout
      confirmPassword={confirmPassword}
      formError={formError}
      handleInput={handleInput}
      handleNavigate={handleNavigate}
      handleSubmit={handleSubmit}
      loading={loading}
      login={login}
      password={password}
      recoveryAnswer={recoveryAnswer}
      recoveryQuestion={recoveryQuestion}
    />
  );
}

export default memo(SignUp);
