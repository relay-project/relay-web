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
import Spinner from '../../components/spinner';
import { useAppDispatch, useAppSelector } from '../../store/hooks';

interface SignUpResponse {
  token: string;
  user: {
    id: number;
    login: string;
    role: string;
  };
}

function SignUp(): React.ReactElement {
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
      if (!(trimmedLogin && trimmedPassword)) {
        return setFormError('Please enter your login and password!');
      }

      setLoading(true);
      await delay();

      return connection?.emit(
        EVENTS.SIGN_UP,
        {
          deviceId: deviceData.deviceId,
          deviceName: deviceData.deviceName || 'test', // TODO: fix
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

  return (
    <div className="flex direction-column">
      { loading && (
        <Spinner />
      ) }
      <h1>
        Sign up
      </h1>
      <form
        className="flex direction-column"
        onSubmit={handleSubmit}
      >
        <input
          name="login"
          onChange={handleInput}
          placeholder="Login"
          type="text"
          value={login}
        />
        <input
          className="mt-1"
          name="password"
          onChange={handleInput}
          placeholder="Password"
          type="password"
          value={password}
        />
        <input
          className="mt-1"
          name="recoveryQuestion"
          onChange={handleInput}
          placeholder="Account recovery question"
          type="text"
          value={recoveryQuestion}
        />
        <input
          className="mt-1"
          name="recoveryAnswer"
          onChange={handleInput}
          placeholder="Account recovery answer"
          type="text"
          value={recoveryAnswer}
        />
        <button
          className="mt-1"
          type="submit"
        >
          Sign up
        </button>
      </form>
      { formError && (
        <div className="mt-1">
          { formError }
        </div>
      ) }
      <button
        className="mt-1"
        onClick={(): void => navigate(`/${ROUTING.signIn}`)}
        type="button"
      >
        Sign into existing account
      </button>
    </div>
  );
}

export default memo(SignUp);
