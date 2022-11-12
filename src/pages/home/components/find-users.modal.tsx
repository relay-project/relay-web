import React, {
  memo,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import Button from '../../../components/button';
// import delay from '../../../utilities/delay';
import {
  ERROR_MESSAGES,
  EVENTS,
  RESPONSE_MESSAGES,
} from '../../../configuration';
import Input from '../../../components/input';
import ModalWrap from '../../../components/modal-wrap';
import { type Response, SocketContext } from '../../../contexts/socket.context';
import { Pagination, UserModel } from '../../../types/models';
import Spinner from '../../../components/spinner';

interface FindUsersModalProps {
  toggleModal: () => void;
  token: string;
}

type FoundUser = Pick<UserModel, 'id' | 'login'>;

interface FindUsersPayload extends Pagination {
  results: FoundUser[];
}

function FindUsersModal(props: FindUsersModalProps): React.ReactElement {
  const {
    toggleModal,
    token,
  } = props;

  const connection = useContext(SocketContext);

  const [formError, setFormError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [pagination, setPagination] = useState<Pagination>({
    currentPage: 1,
    limit: 100,
    totalCount: 0,
    totalPages: 1,
  });
  const [searchInput, setSearchInput] = useState<string>('');
  const [users, setUsers] = useState<FoundUser[]>([]);

  const handleInput = (event: React.FormEvent<HTMLInputElement>): void => {
    const { currentTarget: { value = '' } = {} } = event;
    setFormError('');
    return setSearchInput(value);
  };

  const handleFindUsersResponse = (response: Response<FindUsersPayload>): void => {
    setLoading(false);
    if (response.status > 299) {
      if (response.info === RESPONSE_MESSAGES.VALIDATION_ERROR) {
        return setFormError(ERROR_MESSAGES.providedDataIsInvalid);
      }
      return setFormError(ERROR_MESSAGES.generic);
    }

    const { payload } = response;
    if (!payload) {
      return setFormError(ERROR_MESSAGES.generic);
    }
    const { results, ...rest } = payload;
    setPagination(rest);
    return setUsers([...users, ...results]);
  };

  const handleSubmit = useCallback(
    async (
      event: React.FormEvent<HTMLFormElement>,
    ): Promise<null | typeof connection> => {
      event.preventDefault();
      setFormError('');
      setUsers([]);

      const trimmedSearch = (searchInput || '').trim();
      if (!trimmedSearch) {
        return null;
      }

      setLoading(true);

      return connection.emit(
        EVENTS.FIND_USERS,
        {
          limit: pagination.limit,
          search: trimmedSearch,
          token,
        },
      );
    },
    [searchInput],
  );

  useEffect(
    (): (() => void) => {
      connection.on(EVENTS.FIND_USERS, handleFindUsersResponse);

      return (): void => {
        connection.off(EVENTS.FIND_USERS, handleFindUsersResponse);
      };
    },
    [connection],
  );

  return (
    <ModalWrap>
      { loading && (
        <Spinner />
      ) }
      <div className="flex direction-column width">
        <div className="flex justify-space-between align-items-center">
          <h1>
            Find users
          </h1>
          <Button
            handleClick={toggleModal}
            isLink
          >
            Close
          </Button>
        </div>
        <form
          className="flex justify-space-between mt-1 align-items-center"
          onSubmit={handleSubmit}
        >
          <Input
            handleInput={handleInput}
            name="search"
            placeholder="Search users by their login..."
            styles={{
              width: '100%',
            }}
            value={searchInput}
          />
        </form>
        <div className="flex align-items-center justify-center auth-error noselect">
          { formError && (
            <span className="fade-in">
              { formError }
            </span>
          ) }
        </div>
        { users.length > 0 && users.map((user: FoundUser): React.ReactNode => (
          <div key={user.id}>
            { user.login }
          </div>
        )) }
      </div>
    </ModalWrap>
  );
}

export default memo(FindUsersModal);
