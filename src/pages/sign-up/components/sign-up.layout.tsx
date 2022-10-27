import React, { memo } from 'react';
import { Socket } from 'socket.io-client';

import Button from '../../../components/button';
import Input from '../../../components/input';
import { ROUTING } from '../../../router';
import Spinner from '../../../components/spinner';

interface SignUpLayoutProps {
  confirmPassword: string;
  formError: string;
  handleInput: (event: React.FormEvent<HTMLInputElement>) => void;
  handleNavigate: (destination: string) => void;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => Promise<Socket | void>;
  loading: boolean;
  login: string;
  password: string;
  recoveryAnswer: string;
  recoveryQuestion: string;
}

function SignUpLayout(props: SignUpLayoutProps): React.ReactElement {
  const {
    confirmPassword,
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
          name="login"
          handleInput={handleInput}
          placeholder="Login"
          value={login}
        />
        <Input
          classes={['mt-1']}
          disabled={loading}
          name="password"
          handleInput={handleInput}
          placeholder="Password"
          type="password"
          value={password}
        />
        <Input
          classes={['mt-1']}
          disabled={loading}
          name="confirmPassword"
          handleInput={handleInput}
          placeholder="Confirm password"
          type="password"
          value={confirmPassword}
        />
        <Input
          classes={['mt-1']}
          disabled={loading}
          name="recoveryQuestion"
          handleInput={handleInput}
          placeholder="Account recovery question"
          value={recoveryQuestion}
        />
        <Input
          classes={['mt-1']}
          disabled={loading}
          name="recoveryAnswer"
          handleInput={handleInput}
          placeholder="Account recovery answer"
          value={recoveryAnswer}
        />
        <Button
          classes={['mt-1']}
          isSubmit
        >
          Sign up
        </Button>
      </form>
      <div className="flex align-items-center auth-error mt-1 noselect">
        { formError }
      </div>
      <Button
        classes={['mt-1']}
        disabled={loading}
        handleClick={(): void => handleNavigate(`/${ROUTING.signIn}`)}
        isLink
      >
        I have an account
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
