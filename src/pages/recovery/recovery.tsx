import React, {
  memo,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { ERROR_MESSAGES, MAX_PASSWORD_LENGTH } from '../../configuration';
import RecoveryLayout from './components/recovery.layout';
import useRedirect from '../../hooks/use-redirect';
import delay from '../../utilities/delay';

function Recovery(): React.ReactElement {
  useRedirect(true);

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

  useEffect(
    (): void => {
      if (params && params.login) {
        setLogin(params.login);
      }
    },
    [params],
  );

  const handleInput = (event: React.FormEvent<HTMLInputElement>): void => {
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

  const handleNavigate = (destination: string): void => {
    if (destination === 'back') {
      return navigate(-1);
    }
    return navigate(destination);
  };

  const handleStage1 = useCallback(
    async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
      event.preventDefault();
      setFormError('');

      const trimmedLogin = (login || '').trim();
      if (!trimmedLogin) {
        return setFormError(ERROR_MESSAGES.pleaseProvideTheData);
      }

      setLoading(true);
      await delay();

      // TODO: send request
      setLoading(false);
      setRecoveryQuestion('Test question');
      return setStage(2);
    },
    [login],
  );

  const handleStage2 = useCallback(
    async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
      event.preventDefault();
      setFormError('');

      const trimmedLogin = (login || '').trim();
      if (!trimmedLogin) {
        return setFormError(ERROR_MESSAGES.pleaseProvideTheData);
      }

      setLoading(true);
      await delay();
      setLoading(false);
      // TODO: send request
      return setStage(3);
    },
    [
      confirmPassword,
      password,
      recoveryAnswer,
    ],
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
