import React, { memo } from 'react';
import { Socket } from 'socket.io-client';

import Button from '../../../components/button';
import Input from '../../../components/input';
import { ROUTING } from '../../../router';
import Spinner from '../../../components/spinner';
import Textarea from '../../../components/textarea';

interface SignUpLayoutProps {
  confirmPassword: string;
  deviceName: string;
  formError: string;
  handleInput: (
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  handleNavigate: (destination: string) => void;
  handleSubmit: (
    event: React.FormEvent<HTMLFormElement>,
  ) => Promise<Socket | void>;
  loading: boolean;
  login: string;
  password: string;
  recoveryAnswer: string;
  recoveryQuestion: string;
}

function SignUpLayout(props: SignUpLayoutProps): React.ReactElement {
  const {
    confirmPassword,
    deviceName,
    formError,
    handleInput,
    handleNavigate,
    handleSubmit,
    loading,
    login,
    password,
    recoveryAnswer,
    recoveryQuestion,
  } = props;

  return (
    <div className="auth-page">
      { loading && (
        <Spinner />
      ) }
      <h1 className="noselect">
        Sign up
      </h1>
      <form
        className="auth-form mt-1"
        onSubmit={handleSubmit}
      >
        <Input
          disabled={loading}
          name="login"
          handleInput={handleInput}
          placeholder="Login"
          value={login}
        />
        <Input
          classes={['mt-1']}
          disabled={loading}
          handleInput={handleInput}
          name="password"
          placeholder="Password"
          type="password"
          value={password}
        />
        <Input
          classes={['mt-1']}
          disabled={loading}
          handleInput={handleInput}
          name="confirmPassword"
          placeholder="Confirm password"
          type="password"
          value={confirmPassword}
        />
        <Textarea
          classes={['mt-1']}
          disabled={loading}
          handleInput={handleInput}
          name="recoveryQuestion"
          placeholder="Account recovery question"
          value={recoveryQuestion}
        />
        <Textarea
          classes={['mt-1']}
          disabled={loading}
          handleInput={handleInput}
          name="recoveryAnswer"
          placeholder="Account recovery answer"
          value={recoveryAnswer}
        />
        <Input
          classes={['mt-1']}
          disabled={loading}
          handleInput={handleInput}
          name="deviceName"
          placeholder="Device name"
          value={deviceName}
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
          Sign up
        </Button>
      </form>
      <Button
        classes={['mt-1']}
        disabled={loading}
        handleClick={(): void => handleNavigate(`/${ROUTING.signIn}`)}
        isLink
      >
        I already have an account
      </Button>
      <Button
        classes={['mt-1']}
        disabled={loading}
        handleClick={(): void => handleNavigate('back')}
        isLink
      >
        Back
      </Button>
    </div>
  );
}

export default memo(SignUpLayout);
