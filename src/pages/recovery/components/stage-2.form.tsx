import React, { memo } from 'react';

import Button from '../../../components/button';
import Input from '../../../components/input';
import '../styles.css';

interface Stage2FormProps {
  confirmPassword: string;
  formError: string;
  handleInput: (event: React.FormEvent<HTMLInputElement>) => void;
  handleNavigate: (destination: string) => void;
  handleStage2: (event: React.FormEvent<HTMLFormElement>) => Promise<void>;
  loading: boolean;
  password: string;
  recoveryAnswer: string;
  recoveryQuestion: string;
}

function Stage2Form(props: Stage2FormProps): React.ReactElement {
  const {
    confirmPassword,
    formError,
    handleInput,
    handleNavigate,
    handleStage2,
    loading,
    password,
    recoveryAnswer,
    recoveryQuestion,
  } = props;

  return (
    <>
      <div className="question-title mt-1 noselect">
        Please answer the following question
      </div>
      <div className="question-text mt-1 noselect">
        { recoveryQuestion }
      </div>
      <form
        className="auth-form mt-1"
        onSubmit={handleStage2}
      >
        <Input
          disabled={loading}
          handleInput={handleInput}
          name="recoveryAnswer"
          placeholder="Your answer"
          value={recoveryAnswer}
        />
        <Input
          classes={['mt-1']}
          disabled={loading}
          handleInput={handleInput}
          name="password"
          placeholder="New password"
          type="password"
          value={password}
        />
        <Input
          classes={['mt-1']}
          disabled={loading}
          handleInput={handleInput}
          name="confirmPassword"
          placeholder="Confirm new password"
          type="password"
          value={confirmPassword}
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

export default memo(Stage2Form);
