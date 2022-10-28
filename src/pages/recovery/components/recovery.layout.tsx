import React, { memo } from 'react';

import Spinner from '../../../components/spinner';
import Stage1Form from './stage-1.form';
import Stage2Form from './stage-2.form';

interface RecoveryLayoutProps {
  confirmPassword: string;
  formError: string;
  handleInput: (event: React.FormEvent<HTMLInputElement>) => void;
  handleNavigate: (destination: string) => void;
  handleStage1: (event: React.FormEvent<HTMLFormElement>) => Promise<void>;
  handleStage2: (event: React.FormEvent<HTMLFormElement>) => Promise<void>;
  loading: boolean;
  login: string;
  password: string;
  recoveryAnswer: string;
  recoveryQuestion: string;
  stage: number;
}

function RecoveryLayout(props: RecoveryLayoutProps): React.ReactElement {
  const {
    confirmPassword,
    formError,
    handleInput,
    handleNavigate,
    handleStage1,
    handleStage2,
    loading,
    login,
    password,
    recoveryAnswer,
    recoveryQuestion,
    stage,
  } = props;

  return (
    <div className="auth-page">
      { loading && (
        <Spinner />
      ) }
      <h1 className="noselect">
        Recovery
      </h1>
      { stage === 1 && (
        <Stage1Form
          formError={formError}
          handleInput={handleInput}
          handleNavigate={handleNavigate}
          handleStage1={handleStage1}
          loading={loading}
          login={login}
        />
      ) }
      { stage === 2 && (
        <Stage2Form
          confirmPassword={confirmPassword}
          formError={formError}
          handleInput={handleInput}
          handleNavigate={handleNavigate}
          handleStage2={handleStage2}
          loading={loading}
          password={password}
          recoveryAnswer={recoveryAnswer}
          recoveryQuestion={recoveryQuestion}
        />
      ) }
    </div>
  );
}

export default memo(RecoveryLayout);
