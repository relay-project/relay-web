import React, {
  memo,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import Button from '../../../components/button';
import delay from '../../../utilities/delay';
import {
  ERROR_MESSAGES,
  EVENTS,
  MAX_RECOVERY_ANSWER_LENGTH,
  MAX_RECOVERY_QUESTION_LENGTH,
  RESPONSE_MESSAGES,
} from '../../../configuration';
import formatErrorDetails from '../../../utilities/format-error-details';
import Input from '../../../components/input';
import ModalWrap from '../../../components/modal-wrap';
import { type Response, SocketContext } from '../../../contexts/socket.context';
import Spinner from '../../../components/spinner';
import Textarea from '../../../components/textarea';

interface UpdateRecoveryModalProps {
  toggleModal: () => void;
  token: string;
}

function UpdateRecoveryModal(props: UpdateRecoveryModalProps): React.ReactElement {
  const {
    toggleModal,
    token,
  } = props;

  const connection = useContext(SocketContext);

  const [formError, setFormError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [newRecoveryAnswer, setNewRecoveryAnswer] = useState<string>('');
  const [newRecoveryQuestion, setNewRecoveryQuestion] = useState<string>('');

  const handleInput = (
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
  ): void => {
    const { currentTarget: { name = '', value = '' } = {} } = event;
    setFormError('');
    if (name === 'newRecoveryAnswer') {
      return setNewRecoveryAnswer((state: string): string => {
        if (state.length <= MAX_RECOVERY_ANSWER_LENGTH) {
          return value;
        }
        return state;
      });
    }
    return setNewRecoveryQuestion((state: string): string => {
      if (state.length <= MAX_RECOVERY_QUESTION_LENGTH) {
        return value;
      }
      return state;
    });
  };

  const handleResponse = (response: Response): void => {
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
      return setFormError(ERROR_MESSAGES.generic);
    }

    return toggleModal();
  };

  const handleSubmit = useCallback(
    async (
      event: React.FormEvent<HTMLFormElement>,
    ): Promise<typeof connection | void> => {
      event.preventDefault();
      setFormError('');

      const trimmedNewRecoveryAnswer = (newRecoveryAnswer || '').trim();
      const trimmedNewRecoveryQuestion = (newRecoveryQuestion || '').trim();
      if (!(trimmedNewRecoveryAnswer && trimmedNewRecoveryQuestion)) {
        return setFormError(ERROR_MESSAGES.pleaseProvideTheData);
      }
      if (trimmedNewRecoveryAnswer.length > MAX_RECOVERY_ANSWER_LENGTH) {
        return setFormError(ERROR_MESSAGES.recoveryAnswerIsTooLong);
      }
      if (trimmedNewRecoveryQuestion.length > MAX_RECOVERY_QUESTION_LENGTH) {
        return setFormError(ERROR_MESSAGES.recoveryQuestionIsTooLong);
      }

      setLoading(true);
      await delay();

      return connection.emit(
        EVENTS.UPDATE_RECOVERY_DATA,
        {
          newRecoveryAnswer: trimmedNewRecoveryAnswer,
          newRecoveryQuestion: trimmedNewRecoveryQuestion,
          token,
        },
      );
    },
    [
      newRecoveryAnswer,
      newRecoveryQuestion,
    ],
  );

  useEffect(
    (): (() => void) => {
      connection.on(EVENTS.UPDATE_RECOVERY_DATA, handleResponse);

      return (): void => {
        connection.off(EVENTS.UPDATE_RECOVERY_DATA, handleResponse);
      };
    },
    [connection],
  );

  return (
    <ModalWrap>
      { loading && (
        <Spinner />
      ) }
      <form
        className="flex direction-column"
        onSubmit={handleSubmit}
      >
        <h1>
          Update recovery data
        </h1>
        <Textarea
          classes={['mt-1']}
          disabled={loading}
          handleInput={handleInput}
          name="newRecoveryQuestion"
          placeholder="New recovery question"
          value={newRecoveryQuestion}
        />
        <Input
          classes={['mt-1']}
          disabled={loading}
          handleInput={handleInput}
          name="newRecoveryAnswer"
          placeholder="New recovery answer"
          value={newRecoveryAnswer}
        />
        <div className="flex align-items-center justify-center auth-error noselect">
          { formError && (
            <span className="fade-in">
              { formError }
            </span>
          ) }
        </div>
        <Button
          classes={['button-positive']}
          disabled={loading}
          isSubmit
        >
          Save
        </Button>
        <Button
          classes={['mt-1']}
          disabled={loading}
          handleClick={toggleModal}
        >
          Cancel
        </Button>
      </form>
    </ModalWrap>
  );
}

export default memo(UpdateRecoveryModal);
