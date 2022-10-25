import React, {
  memo,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useNavigate } from 'react-router-dom';

import delay from '../../utilities/delay';
import { EVENTS } from '../../configuration';
import { type Response, SocketContext } from '../../contexts/socket.context';
import { ROUTING } from '../../router';
import { setUserData } from '../../store/features/user.slice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import './styles.css';

interface SignInPayload {
  token: string;
  user: {
    id: number;
    login: string;
    role: string;
  };
}

function SignIn(): React.ReactElement {
  const connection = useContext(SocketContext);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [formError, setFormError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [login, setLogin] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const userData = useAppSelector((state) => state.user);

  useEffect(
    (): void => {
      if (userData.id && userData.token) {
        navigate(`/${ROUTING.home}`);
      }
    },
    [],
  );

  const handleResponse = (response: Response<SignInPayload>): void => {
    setLoading(false);
    if (response.status !== 200) {
      // TODO: better error handling
      return setFormError(response.details || response.info);
    }

    if (!response.payload) {
      return setFormError('Something went wrong...');
    }

    const { token, user } = response.payload;
    dispatch(setUserData({
      ...user,
      token,
    }));

    return navigate(`/${ROUTING.home}`);
  };

  useEffect(
    (): (() => void) => {
      connection?.on(EVENTS.SIGN_IN, handleResponse);

      return (): void => {
        connection?.off(EVENTS.SIGN_IN, handleResponse);
      };
    },
    [connection],
  );

  const handleInput = (event: React.FormEvent<HTMLInputElement>): void => {
    const { currentTarget: { name = '', value = '' } = {} } = event;
    setFormError('');
    if (name === 'login') {
      return setLogin(value);
    }
    return setPassword(value);
  };

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>): Promise<typeof connection | void> => {
      event.preventDefault();

      const trimmedLogin = (login || '').trim();
      const trimmedPassword = (password || '').trim();
      if (!(trimmedLogin && trimmedPassword)) {
        return setFormError('Please enter your login and password!');
      }

      setLoading(true);
      await delay();

      return connection?.emit(
        EVENTS.SIGN_IN,
        {
          login,
          password,
        },
      );
    },
    [
      login,
      password,
    ],
  );

  return (
    <div className="flex direction-column">
      { loading && (
        <h1>
          Loading...
        </h1>
      ) }
      { !loading && (
        <>
          <h1>
            Sign up
          </h1>
          <form
            className="flex direction-column centered"
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
            <button
              className="mt-1"
              type="submit"
            >
              Sign in
            </button>
          </form>
          { !!formError && (
            <div className="mt-1">
              { formError }
            </div>
          ) }
          <button
            className="mt-1"
            onClick={(): void => navigate(`/${ROUTING.signUp}`)}
            type="button"
          >
            Create account
          </button>
        </>
      ) }
    </div>
  );
}

export default memo(SignIn);
