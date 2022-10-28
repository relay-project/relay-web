import React, {
  memo,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import delay from '../../utilities/delay';
import {
  ERROR_MESSAGES,
  EVENTS,
  MAX_PASSWORD_LENGTH,
  MIN_PASSWORD_LENGTH,
  RESPONSE_MESSAGES,
} from '../../configuration';
import formatErrorDetails from '../../utilities/format-error-details';
import RecoveryLayout from './components/recovery.layout';
import { type Response, SocketContext } from '../../contexts/socket.context';
import useRedirect from '../../hooks/use-redirect';

interface Stage1Payload {
  user: {
    id: number;
    login: string;
    recoveryQuestion: string;
  };
}

function Recovery(): React.ReactElement {
  useRedirect(true);

  const connection = useContext(SocketContext);
  const navigate = useNavigate();
  const params = useParams();

  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [formError, setFormError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [login, setLogin] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [recoveryAnswer, setRecoveryAnswer] = useState<string>('');
  const [recoveryQuestion, setRecoveryQuestion] = useState<string>('');
  const [stage, setStage] = useState<number>(1);
  const [userId, setUserId] = useState<null | number>(null);

  useEffect(
    (): void => {
      if (params && params.login) {
        setLogin(params.login);
      }
    },
    [params],
  );

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
    if (name === 'login') {
      return setLogin(value);
    }
    if (name === 'password') {
      return setPassword((state: string): string => {
        if (state.length <= MAX_PASSWORD_LENGTH) {
          return value;
        }
        return state;
      });
    }
    return setRecoveryAnswer(value);
  };

  const handleNavigate = useCallback(
    (destination: string): void => {
      if (destination === 'back') {
        if (stage === 1 || stage === 3) {
          return navigate(-1);
        }
        if (stage === 2) {
          return setStage(1);
        }
      }
      return navigate(destination);
    },
    [stage],
  );

  const handleStage1 = useCallback(
    async (
      event: React.FormEvent<HTMLFormElement>,
    ): Promise<typeof connection | void> => {
      event.preventDefault();
      setFormError('');

      const trimmedLogin = (login || '').trim();
      if (!trimmedLogin) {
        return setFormError(ERROR_MESSAGES.pleaseProvideTheData);
      }

      setLoading(true);
      await delay();

      return connection.emit(
        EVENTS.RECOVERY_INITIAL_STAGE,
        {
          login: trimmedLogin,
        },
      );
    },
    [login],
  );

  const handleStage1Response = (response: Response<Stage1Payload>): void => {
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
      return setFormError(ERROR_MESSAGES.generic);
    }

    if (!response.payload) {
      return setFormError(ERROR_MESSAGES.generic);
    }

    const { user } = response.payload;
    setRecoveryQuestion(user.recoveryQuestion);
    setUserId(user.id);
    return setStage(2);
  };

  const handleStage2 = useCallback(
    async (
      event: React.FormEvent<HTMLFormElement>,
    ): Promise<typeof connection | void> => {
      event.preventDefault();
      setFormError('');

      const trimmedConfirmPassword = (confirmPassword || '').trim();
      const trimmedPassword = (password || '').trim();
      const trimmedRecoveryAnswer = (recoveryAnswer || '').trim();
      if (!(trimmedConfirmPassword && trimmedPassword
        && trimmedRecoveryAnswer)) {
        return setFormError(ERROR_MESSAGES.pleaseProvideTheData);
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

      setLoading(true);
      await delay();

      return connection.emit(
        EVENTS.RECOVERY_FINAL_STAGE,
        {
          newPassword: trimmedPassword,
          recoveryAnswer: trimmedRecoveryAnswer,
          userId,
        },
      );
    },
    [
      confirmPassword,
      password,
      recoveryAnswer,
      userId,
    ],
  );

  const handleStage2Response = (response: Response): null | void => {
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
      return setFormError(ERROR_MESSAGES.generic);
    }

    return setStage(3);
  };

  useEffect(
    (): (() => void) => {
      connection.on(EVENTS.RECOVERY_FINAL_STAGE, handleStage2Response);
      connection.on(EVENTS.RECOVERY_INITIAL_STAGE, handleStage1Response);

      return (): void => {
        connection.off(EVENTS.RECOVERY_FINAL_STAGE, handleStage2Response);
        connection.off(EVENTS.RECOVERY_INITIAL_STAGE, handleStage1Response);
      };
    },
    [connection],
  );

  return (
    <RecoveryLayout
      confirmPassword={confirmPassword}
      formError={formError}
      handleInput={handleInput}
      handleNavigate={handleNavigate}
      handleStage1={handleStage1}
      handleStage2={handleStage2}
      loading={loading}
      login={login}
      password={password}
      recoveryAnswer={recoveryAnswer}
      recoveryQuestion={recoveryQuestion}
      stage={stage}
    />
  );
}

export default memo(Recovery);
