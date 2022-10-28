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
  MAX_DEVICE_NAME_LENGTH,
  MAX_LOGIN_LENGTH,
  MAX_PASSWORD_LENGTH,
  MAX_RECOVERY_ANSWER_LENGTH,
  MAX_RECOVERY_QUESTION_LENGTH,
  MIN_PASSWORD_LENGTH,
  RESPONSE_MESSAGES,
} from '../../configuration';
import formatErrorDetails from '../../utilities/format-error-details';
import isAlphanumeric from '../../utilities/is-alphanumeric';
import { type Response, SocketContext } from '../../contexts/socket.context';
import { ROUTING } from '../../router';
import {
  setDeviceName as setDeviceNameRegistered,
} from '../../store/features/device.slice';
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

  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [deviceName, setDeviceName] = useState<string>('');
  const [formError, setFormError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [login, setLogin] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [recoveryAnswer, setRecoveryAnswer] = useState<string>('');
  const [recoveryQuestion, setRecoveryQuestion] = useState<string>('');

  const handleInput = (
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
  ): void => {
    const { currentTarget: { name = '', value = '' } = {} } = event;
    setFormError('');
    if (name === 'confirmPassword') {
      return setConfirmPassword((state: string): string => {
        if (state.length <= MAX_PASSWORD_LENGTH) {
          return value;
        }
        return state;
      });
    }
    if (name === 'deviceName') {
      return setDeviceName((state: string): string => {
        if (state.length <= MAX_DEVICE_NAME_LENGTH) {
          return value;
        }
        return state;
      });
    }
    if (name === 'login') {
      return setLogin((state: string): string => {
        if (state.length <= MAX_LOGIN_LENGTH) {
          return value.toLowerCase();
        }
        return state;
      });
    }
    if (name === 'password') {
      return setPassword((state: string): string => {
        if (state.length <= MAX_PASSWORD_LENGTH) {
          return value;
        }
        return state;
      });
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

  const handleNavigate = (destination: string): void => {
    if (destination === 'back') {
      return navigate(-1);
    }
    return navigate(destination);
  };

  const handleResponse = (response: Response<SignUpResponse>): void => {
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
      if (response.info === RESPONSE_MESSAGES.LOGIN_ALREADY_IN_USE
        && response.status === 400) {
        return setFormError(ERROR_MESSAGES.loginAlreadyInUse);
      }
      return setFormError(ERROR_MESSAGES.generic);
    }

    if (!response.payload) {
      return setFormError('Something went wrong...');
    }

    const { token: tokenString, user } = response.payload;
    dispatch(setDeviceNameRegistered(deviceName));
    dispatch(setUserData({
      token: tokenString,
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
    async (event: React.FormEvent<HTMLFormElement>): Promise<typeof connection | void> => {
      event.preventDefault();
      setFormError('');

      const trimmedConfirmPassword = (confirmPassword || '').trim();
      const trimmedDeviceName = (deviceName || '').trim();
      const trimmedLogin = (login || '').trim();
      const trimmedPassword = (password || '').trim();
      const trimmedRecoveryAnswer = (recoveryAnswer || '').trim();
      const trimmedRecoveryQuestion = (recoveryQuestion || '').trim();
      if (!(trimmedConfirmPassword && trimmedDeviceName
        && trimmedLogin && trimmedPassword
        && trimmedRecoveryAnswer && trimmedRecoveryQuestion)) {
        return setFormError(ERROR_MESSAGES.pleaseProvideTheData);
      }
      if (login.length > MAX_LOGIN_LENGTH) {
        return setFormError(ERROR_MESSAGES.loginIsTooLong);
      }
      if (!isAlphanumeric(login)) {
        return setFormError(ERROR_MESSAGES.loginShouldBeAlphanumeric);
      }
      if (trimmedPassword.length < MIN_PASSWORD_LENGTH) {
        return setFormError(ERROR_MESSAGES.passwordIsTooShort);
      }
      if (trimmedPassword.length > MAX_PASSWORD_LENGTH) {
        return setFormError(ERROR_MESSAGES.passwordIsTooLong);
      }
      if (trimmedConfirmPassword !== trimmedPassword) {
        return setFormError(ERROR_MESSAGES.passwordConfirmationIsInvalid);
      }
      if (trimmedRecoveryAnswer.length > MAX_RECOVERY_ANSWER_LENGTH) {
        return setFormError(ERROR_MESSAGES.recoveryAnswerIsTooLong);
      }
      if (trimmedRecoveryQuestion.length > MAX_RECOVERY_QUESTION_LENGTH) {
        return setFormError(ERROR_MESSAGES.recoveryAnswerIsTooLong);
      }

      setLoading(true);
      await delay();

      return connection.emit(
        EVENTS.SIGN_UP,
        {
          deviceId: deviceData.deviceId,
          deviceName: trimmedDeviceName,
          login: trimmedLogin,
          password: trimmedPassword,
          recoveryAnswer: trimmedRecoveryAnswer,
          recoveryQuestion: trimmedRecoveryQuestion,
        },
      );
    },
    [
      confirmPassword,
      deviceData,
      deviceName,
      login,
      password,
      recoveryAnswer,
      recoveryQuestion,
    ],
  );

  useEffect(
    (): (() => void) => {
      connection.on(EVENTS.SIGN_UP, handleResponse);

      return (): void => {
        connection.off(EVENTS.SIGN_UP, handleResponse);
      };
    },
    [connection],
  );

  return (
    <SignUpLayout
      confirmPassword={confirmPassword}
      deviceName={deviceName}
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
