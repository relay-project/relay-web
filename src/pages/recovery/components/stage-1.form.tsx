import React, { memo } from 'react';

import Button from '../../../components/button';
import Input from '../../../components/input';

interface Stage1FormProps {
  formError: string;
  handleInput: (event: React.FormEvent<HTMLInputElement>) => void;
  handleNavigate: (destination: string) => void;
  handleStage1: (event: React.FormEvent<HTMLFormElement>) => Promise<void>;
  login: string;
  loading: boolean;
}

function Stage1Form(props: Stage1FormProps): React.ReactElement {
  const {
    formError,
    handleInput,
    handleNavigate,
    handleStage1,
    login,
    loading,
  } = props;

  return (
    <>
      <form
        className="auth-form mt-1"
        onSubmit={handleStage1}
      >
        <Input
          disabled={loading}
          handleInput={handleInput}
          name="login"
          placeholder="Please type your login"
          value={login}
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
          Continue
        </Button>
      </form>
      <Button
        classes={['mt-1']}
        disabled={loading}
        handleClick={(): void => handleNavigate('back')}
        isLink
      >
        Back
      </Button>
    </>
  );
}

export default memo(Stage1Form);
