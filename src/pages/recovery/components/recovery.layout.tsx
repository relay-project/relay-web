import React, { memo } from 'react';
import { type Socket } from 'socket.io-client';

import Spinner from '../../../components/spinner';
import Stage1Form from './stage-1.form';
import Stage2Form from './stage-2.form';
import Stage3Layout from './stage-3.layout';

interface RecoveryLayoutProps {
  confirmPassword: string;
  formError: string;
  handleInput: (
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  handleNavigate: (destination: string) => void;
  handleStage1: (event: React.FormEvent<HTMLFormElement>) => Promise<Socket | void>;
  handleStage2: (event: React.FormEvent<HTMLFormElement>) => Promise<Socket | void>;
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
      { stage === 3 && (
        <Stage3Layout handleNavigate={handleNavigate} />
      ) }
    </div>
  );
}

export default memo(RecoveryLayout);
