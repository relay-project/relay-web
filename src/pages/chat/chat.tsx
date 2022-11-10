import React, {
  memo,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import {
  CHAT_TYPES,
  ERROR_MESSAGES,
  EVENTS,
} from '../../configuration';
import { type Response, SocketContext } from '../../contexts/socket.context';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import useRedirect from '../../hooks/use-redirect';
import type {
  ChatModel,
  MessageModel,
  Pagination,
  UserModel,
} from '../../types/models';
import Spinner from '../../components/spinner';

interface ChatUser extends UserModel {
  chatId: number;
  joinedChat: string;
}

interface GetChatPayload extends ChatModel {
  users: ChatUser[];
}

interface UserMessage extends MessageModel {
  isAuthor: boolean;
  login: string;
}

interface GetMessagesPayload extends Pagination {
  results: UserMessage[];
}

function Chat(): React.ReactElement {
  useRedirect();

  const connection = useContext(SocketContext);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const params = useParams();

  const [chatData, setChatData] = useState<ChatModel>();
  const [chatUsers, setChatUsers] = useState<ChatUser[]>([]);
  const [chatLoading, setChatLoading] = useState<boolean>(true);
  const [chatMessagesLoading, setChatMessagesLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [messages, setMessages] = useState<UserMessage[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    currentPage: 1,
    limit: 100,
    totalCount: 0,
    totalPages: 1,
  });
  const [subscribed, setSubscribed] = useState<boolean>(false);

  const { id, token } = useAppSelector((state) => state.user);

  const chatName = useMemo(
    (): string => {
      if (chatData && chatData.type === CHAT_TYPES.private && chatUsers) {
        const [anotherUser = null] = chatUsers.filter(
          (user: ChatUser): boolean => user.id !== id,
        );
        if (!anotherUser) {
          return 'Chat';
        }
        return `Chat with ${anotherUser.login}`;
      }
      return 'Chat';
    },
    [
      chatData,
      chatUsers,
      id,
    ],
  );

  const handleGetChatResponse = (response: Response<GetChatPayload>): void => {
    setChatLoading(false);

    // TODO: handle errors

    if (!response.payload) {
      return setError(ERROR_MESSAGES.generic);
    }

    const { users, ...rest } = response.payload;
    setChatData(rest);
    return setChatUsers(users);
  };

  const handleGetChatMessagesResponse = (
    response: Response<GetMessagesPayload>,
  ): void => {
    setChatMessagesLoading(false);

    // TODO: handle errors

    if (!response.payload) {
      return setError(ERROR_MESSAGES.generic);
    }

    const { results, ...rest } = response.payload;
    setMessages(results);
    return setPagination(rest);
  };

  useEffect(
    (): (() => void) => {
      connection.on(EVENTS.GET_CHAT, handleGetChatResponse);
      connection.on(EVENTS.GET_CHAT_MESSAGES, handleGetChatMessagesResponse);

      setSubscribed(true);
      return (): void => {
        connection.off(EVENTS.GET_CHAT, handleGetChatResponse);
        connection.off(EVENTS.GET_CHAT_MESSAGES, handleGetChatMessagesResponse);
      };
    },
    [],
  );

  useEffect(
    (): void => {
      if (subscribed) {
        const payload = {
          chatId: params.id,
          token,
        };
        connection.emit(EVENTS.GET_CHAT, payload);
        connection.emit(EVENTS.GET_CHAT_MESSAGES, payload);
      }
    },
    [subscribed],
  );

  return (
    <div>
      { chatLoading && (
        <Spinner />
      ) }
      <h1>
        { chatData && chatData.type === CHAT_TYPES.private && (
          <span>
            { chatName }
          </span>
        ) }
      </h1>
      { chatMessagesLoading && (
        <div>
          Loading messages
        </div>
      ) }
      { !chatMessagesLoading && (
        <>
          { messages.length === 0 && (
            <div>
              Messages not found!
            </div>
          ) }
          { messages.length > 0 && messages.map(
            (message: UserMessage): React.ReactNode => (
              <div
                className="flex direction-column mt-1"
                key={message.id}
              >
                <div>
                  { `${message.login} wrote:` }
                </div>
                <div>
                  { message.text }
                </div>
              </div>
            ),
          ) }
        </>
      ) }
    </div>
  );
}

export default memo(Chat);
