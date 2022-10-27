import React, { memo } from 'react';
import type { Socket } from 'socket.io-client';

import Button from '../../../components/button';
import Input from '../../../components/input';
import { ROUTING } from '../../../router';
import Spinner from '../../../components/spinner';

interface SignInLayoutProps {
  formError: string;
  handleInput: (event: React.FormEvent<HTMLInputElement>) => void;
  handleNavigate: (destination: string) => void;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => Promise<Socket | void>;
  loading: boolean;
  login: string;
  password: string;
}

function SignInLayout(props: SignInLayoutProps): React.ReactElement {
  const {
    formError,
    handleInput,
    handleNavigate,
    handleSubmit,
    loading,
    login,
    password,
  } = props;

  return (
    <div className="auth-page">
      { loading && (
        <Spinner />
      ) }
      <h1 className="noselect">
        Sign in
      </h1>
      <form
        className="auth-form mt-1"
        onSubmit={handleSubmit}
      >
        <Input
          disabled={loading}
          handleInput={handleInput}
          name="login"
          placeholder="Login"
          value={login}
        />
        <Input
          disabled={loading}
          classes={['mt-1']}
          handleInput={handleInput}
          name="password"
          placeholder="Password"
          type="password"
          value={password}
        />
        <Button
          classes={['mt-1']}
          disabled={loading}
          isSubmit
        >
          Sign in
        </Button>
      </form>
      <div className="flex align-items-center auth-error mt-1 noselect">
        { formError }
      </div>
      <Button
        classes={['mt-1']}
        disabled={loading}
        handleClick={(): void => handleNavigate(`/${ROUTING.recovery}`)}
        isLink
      >
        I forgot my password
      </Button>
      <Button
        classes={['mt-1']}
        disabled={loading}
        handleClick={(): void => handleNavigate(`/${ROUTING.signUp}`)}
        isLink
      >
        Create account
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

export default memo(SignInLayout);
