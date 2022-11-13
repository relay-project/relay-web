import React, {
  memo,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import Button from '../../components/button';
import {
  ERROR_MESSAGES,
  EVENTS,
  PAGINATION_DEFAULTS,
  RESPONSE_MESSAGES,
} from '../../configuration';
import Input from '../../components/input';
import type { Pagination, UserModel } from '../../types/models';
import { type Response, SocketContext } from '../../contexts/socket.context';
import useDebounce from '../../hooks/use-debounce';
import useRedirect from '../../hooks/use-redirect';
import { useAppSelector } from '../../store/hooks';

type FoundUser = Pick<UserModel, 'id' | 'login'>;

interface FindUsersPayload extends Pagination {
  results: FoundUser[];
}

function CreateChat(): React.ReactElement {
  useRedirect();
  const connection = useContext(SocketContext);

  const [searchError, setSearchError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [pagination, setPagination] = useState<Pagination>(PAGINATION_DEFAULTS);
  const [searchInput, setSearchInput] = useState<string>('');
  const [selectedUsers, setSelectedUsers] = useState<FoundUser[]>([]);
  const [users, setUsers] = useState<FoundUser[]>([]);

  const debouncedSearch: string = useDebounce<string>(searchInput, 500);
  const { token } = useAppSelector((state) => state.user);

  const handleInput = (event: React.FormEvent<HTMLInputElement>): void => {
    const { currentTarget: { value = '' } = {} } = event;
    setSearchError('');
    return setSearchInput(value);
  };

  const handleFindUsersResponse = (response: Response<FindUsersPayload>): void => {
    setLoading(false);
    if (response.status > 299) {
      if (response.info === RESPONSE_MESSAGES.VALIDATION_ERROR) {
        return setSearchError(ERROR_MESSAGES.providedDataIsInvalid);
      }
      return setSearchError(ERROR_MESSAGES.generic);
    }

    const { payload } = response;
    if (!payload) {
      return setSearchError(ERROR_MESSAGES.generic);
    }
    const { results, ...rest } = payload;
    setPagination(rest);
    return setUsers([...users, ...results]);
  };

  const handleRemoveSelectedUser = useCallback(
    (userId: number): void => setSelectedUsers(
      (state: FoundUser[]): FoundUser[] => state.filter(
        (user: FoundUser): boolean => user.id !== userId,
      ),
    ),
    [selectedUsers],
  );

  const handleSelectUser = useCallback(
    (user: FoundUser): null | void => {
      const [alreadySelected = null] = selectedUsers.filter(
        (selected: FoundUser): boolean => selected.id === user.id,
      );
      if (alreadySelected) {
        return null;
      }
      return setSelectedUsers([...selectedUsers, user]);
    },
    [selectedUsers],
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

  useEffect(
    (): void => {
      const trimmedSearch = (debouncedSearch || '').trim();
      setSearchError('');
      setUsers([]);
      if (trimmedSearch) {
        setLoading(true);
        connection.emit(
          EVENTS.FIND_USERS,
          {
            limit: pagination.limit,
            search: trimmedSearch,
            token,
          },
        );
      }
    },
    [debouncedSearch],
  );

  return (
    <div className="flex direction-column">
      <div className="flex direction-column width">
        <h1>
          Create new chat
        </h1>
        <Input
          classes={['mt-1']}
          handleInput={handleInput}
          loading={loading}
          name="search"
          placeholder="Search users by their login..."
          styles={{
            width: '100%',
          }}
          value={searchInput}
          withSpinner
        />
        { searchError && (
          <div className="flex align-items-center justify-center auth-error fade-in noselect">
            { searchError }
          </div>
        ) }
        { !searchError && users.length > 0 && users.map((user: FoundUser): React.ReactNode => (
          <div
            className="fade-in mt-1"
            key={user.id}
          >
            <Button
              handleClick={(): null | void => handleSelectUser(user)}
              isLink
            >
              { user.login }
            </Button>
          </div>
        )) }
        <div className="flex mt-1">
          { selectedUsers.length > 0 && selectedUsers.map((user: FoundUser): React.ReactNode => (
            <div
              className="flex fade-in pill"
              key={user.id}
            >
              <span>
                { user.login }
              </span>
              <Button
                handleClick={(): void => handleRemoveSelectedUser(user.id)}
                isLink
              >
                Remove
              </Button>
            </div>
          )) }
        </div>
      </div>
    </div>
  );
}

export default memo(CreateChat);
