import React, {
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useNavigate } from 'react-router-dom';

import Button from '../../components/button';
import CloseIcon from '../../icons/close';
import {
  COLORS,
  ERROR_MESSAGES,
  EVENTS,
  PAGINATION_DEFAULTS,
  RESPONSE_MESSAGES,
  SPACER,
} from '../../configuration';
import delay from '../../utilities/delay';
import Input from '../../components/input';
import type { Pagination, UserModel } from '../../types/models';
import { type Response, SocketContext } from '../../contexts/socket.context';
import { ROUTING } from '../../router';
import Spinner from '../../components/spinner';
import useDebounce from '../../hooks/use-debounce';
import useRedirect from '../../hooks/use-redirect';
import { useAppSelector } from '../../store/hooks';
import './styles.css';

type FoundUser = Pick<UserModel, 'id' | 'login'>;

interface FindUsersPayload extends Pagination {
  results: FoundUser[];
}

function CreateChat(): React.ReactElement {
  useRedirect();
  const connection = useContext(SocketContext);
  const navigate = useNavigate();

  const [chatNameInput, setChatNameInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [pagination, setPagination] = useState<Pagination>(PAGINATION_DEFAULTS);
  const [searchError, setSearchError] = useState<string>('');
  const [searchInput, setSearchInput] = useState<string>('');
  const [searchLoading, setSearchLoading] = useState<boolean>(false);
  const [selectedUsers, setSelectedUsers] = useState<FoundUser[]>([]);
  const [users, setUsers] = useState<FoundUser[]>([]);

  const debouncedSearch: string = useDebounce<string>(searchInput, 500);
  const { token } = useAppSelector((state) => state.user);

  const disableCreateButton = useMemo(
    (): boolean => selectedUsers.length === 0
      || (selectedUsers.length > 1 && !chatNameInput),
    [
      chatNameInput,
      selectedUsers,
    ],
  );

  const startChatText = useMemo(
    (): string => {
      if (selectedUsers.length === 0) {
        return 'Start chat';
      }
      if (selectedUsers.length === 1) {
        return `Start chat with ${selectedUsers[0].login}`;
      }
      return `Start chat with ${selectedUsers.length} users`;
    },
    [selectedUsers],
  );

  const handleCreateChat = useCallback(
    async (): Promise<null | typeof connection> => {
      if (selectedUsers.length === 0) {
        return null;
      }
      const selectedIds = selectedUsers.map((user: FoundUser): number => user.id);
      const trimmedChatName = (chatNameInput || '').trim();
      if (selectedIds.length > 1 && !trimmedChatName) {
        return null;
      }
      setLoading(true);
      await delay();
      return connection.emit(
        EVENTS.CREATE_CHAT,
        {
          chatName: trimmedChatName,
          invited: selectedIds,
          token,
        },
      );
    },
    [
      chatNameInput,
      selectedUsers,
    ],
  );

  const handleCreateChatResponse = (
    response: Response<{ chatId: number, isNew: boolean }>,
  ): void => {
    setLoading(false);
    if (response.status > 299) {
      const { info } = response;
      if (info === RESPONSE_MESSAGES.VALIDATION_ERROR) {
        return setSearchInput(ERROR_MESSAGES.providedDataIsInvalid);
      }
      if (info === RESPONSE_MESSAGES.MISSING_DATA) {
        return setSearchInput(ERROR_MESSAGES.missingRequiredData);
      }
      return setSearchInput(ERROR_MESSAGES.generic);
    }

    const { payload: { chatId = null } = {} } = response;
    if (!chatId) {
      return setSearchError(ERROR_MESSAGES.generic);
    }
    return navigate(`/${ROUTING.chat}/${chatId}`);
  };

  const handleInput = (event: React.FormEvent<HTMLInputElement>): void => {
    const { currentTarget: { name = '', value = '' } = {} } = event;
    setSearchError('');
    if (name === 'chatName') {
      return setChatNameInput(value);
    }
    return setSearchInput(value);
  };

  // TODO: pagination for user search

  const handleFindUsersResponse = (response: Response<FindUsersPayload>): void => {
    setSearchLoading(false);
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
      connection.on(EVENTS.CREATE_CHAT, handleCreateChatResponse);
      connection.on(EVENTS.FIND_USERS, handleFindUsersResponse);

      return (): void => {
        connection.off(EVENTS.CREATE_CHAT, handleCreateChatResponse);
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
        setSearchLoading(true);
        delay(500).then((): void => {
          connection.emit(
            EVENTS.FIND_USERS,
            {
              limit: pagination.limit,
              search: trimmedSearch,
              token,
            },
          );
        });
      }
    },
    [debouncedSearch],
  );

  return (
    <div className="flex direction-column">
      { loading && (
        <Spinner />
      ) }
      <div className="flex direction-column width">
        <h1 className="noselect">
          Create new chat
        </h1>
        <Input
          classes={['mt-1']}
          handleInput={handleInput}
          loading={searchLoading}
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
          { selectedUsers.length > 0 && selectedUsers.map(
            (user: FoundUser): React.ReactNode => (
              <div
                className="flex align-items-center fade-in tag"
                key={user.id}
              >
                <span className="noselect">
                  { user.login }
                </span>
                <Button
                  classes={['ml-half']}
                  handleClick={(): void => handleRemoveSelectedUser(user.id)}
                  isLink
                  styles={{
                    height: SPACER,
                  }}
                  title="Remove"
                >
                  <CloseIcon />
                </Button>
              </div>
            ),
          ) }
        </div>
        { selectedUsers.length > 1 && (
          <Input
            classes={['fade-in', 'mt-1']}
            handleInput={handleInput}
            name="chatName"
            placeholder="Chat name"
            value={chatNameInput}
          />
        ) }
        <Button
          classes={['mt-1']}
          disabled={disableCreateButton}
          handleClick={handleCreateChat}
          styles={{
            background: disableCreateButton
              ? COLORS.muted
              : COLORS.accent,
          }}
        >
          { startChatText }
        </Button>
      </div>
    </div>
  );
}

export default memo(CreateChat);
