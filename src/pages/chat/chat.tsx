import React, {
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import {
  CHAT_TYPES,
  ERROR_MESSAGES,
  EVENTS,
} from '../../configuration';
import { type Response, SocketContext } from '../../contexts/socket.context';
import { useAppSelector } from '../../store/hooks';
import useRedirect from '../../hooks/use-redirect';
import type {
  ChatModel,
  MessageModel,
  Pagination,
  UserModel,
} from '../../types/models';
import Spinner from '../../components/spinner';
import Input from '../../components/input';
import Button from '../../components/button';
import './styles.css';
import { ROUTING } from '../../router';

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
  const navigate = useNavigate();
  const params = useParams();

  const [chatData, setChatData] = useState<ChatModel>();
  const [chatUsers, setChatUsers] = useState<ChatUser[]>([]);
  const [chatLoading, setChatLoading] = useState<boolean>(true);
  const [chatMessagesLoading, setChatMessagesLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [messages, setMessages] = useState<UserMessage[]>([]);
  const [messageInput, setMessageInput] = useState<string>('');
  const [pagination, setPagination] = useState<Pagination>({
    currentPage: 1,
    limit: 100,
    totalCount: 0,
    totalPages: 1,
  });
  const [subscribed, setSubscribed] = useState<boolean>(false);

  const {
    id,
    login,
    token,
  } = useAppSelector((state) => state.user);

  const chatName = useMemo(
    (): string => {
      if (chatData && chatUsers) {
        if (chatData.type === CHAT_TYPES.private) {
          const [anotherUser = null] = chatUsers.filter(
            (user: ChatUser): boolean => user.id !== id,
          );
          if (!anotherUser) {
            return 'Chat';
          }
          return `Chat with ${anotherUser.login}`;
        }
        const loginList = chatUsers.reduce(
          (array: string[], user: ChatUser): string[] => {
            if (user.id === id) {
              return array;
            }
            array.push(user.login);
            return array;
          },
          [],
        );
        return `Chat with ${loginList.join(', ')}`;
      }
      return 'Chat';
    },
    [
      chatData,
      chatUsers,
      id,
    ],
  );

  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = (): void => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(
    (): void => {
      scrollToBottom();
    },
    [messages],
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
    setMessages(results.reverse());
    setPagination(rest);
    return scrollToBottom();
  };

  const handleInput = (event: React.FormEvent<HTMLInputElement>): void => {
    const { currentTarget: { value = '' } = {} } = event;
    return setMessageInput(value);
  };

  const handleHideChat = useCallback(
    (): void => {
      connection.emit(
        EVENTS.HIDE_CHAT,
        {
          chatId: chatData?.id,
          token,
        },
      );
      return setChatLoading(true);
    },
    [chatData],
  );

  const handleHideChatResponse = (response: Response): void => {
    setChatLoading(false);

    if (response.status > 299) {
      // TODO: handle error response
    }

    return navigate(
      `/${ROUTING.home}`,
      {
        replace: true,
      },
    );
  };

  const handleSendMessage = (
    event: React.FormEvent<HTMLFormElement>,
  ): null | void => {
    event.preventDefault();
    const trimmedMessage = (messageInput || '').trim();
    if (!trimmedMessage) {
      return null;
    }
    connection.emit(
      EVENTS.SEND_MESSAGE,
      {
        chatId: chatData?.id,
        text: messageInput,
        token,
      },
    );
    return setMessageInput('');
  };

  const handleSendMessageResponse = (response: Response<UserMessage>): null | void => {
    const { payload: incomingMessage = null } = response;
    if (!incomingMessage) {
      return null;
    }
    return setMessages(
      (state: UserMessage[]): UserMessage[] => [
        ...state,
        incomingMessage,
      ],
    );
  };

  const handleIncomingMessage = (message: UserMessage): void => setMessages(
    (state: UserMessage[]): UserMessage[] => [
      ...state,
      message,
    ],
  );

  useEffect(
    (): (() => void) => {
      connection.on(EVENTS.GET_CHAT, handleGetChatResponse);
      connection.on(EVENTS.GET_CHAT_MESSAGES, handleGetChatMessagesResponse);
      connection.on(EVENTS.HIDE_CHAT, handleHideChatResponse);
      connection.on(EVENTS.INCOMING_CHAT_MESSAGE, handleIncomingMessage);
      connection.on(EVENTS.SEND_MESSAGE, handleSendMessageResponse);

      setSubscribed(true);
      return (): void => {
        connection.off(EVENTS.GET_CHAT, handleGetChatResponse);
        connection.off(EVENTS.GET_CHAT_MESSAGES, handleGetChatMessagesResponse);
        connection.off(EVENTS.HIDE_CHAT, handleHideChatResponse);
        connection.off(EVENTS.INCOMING_CHAT_MESSAGE, handleIncomingMessage);
        connection.off(EVENTS.SEND_MESSAGE, handleSendMessageResponse);
      };
    },
    [],
  );

  useEffect(
    (): (() => void) => (): void => {
      if (chatData && chatData.id) {
        connection.emit(
          EVENTS.LEAVE_ROOM,
          {
            chatId: chatData.id,
            token,
          },
        );
      }
    },
    [chatData],
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
      <div className="flex justify-space-between align-items-center">
        <h1>
          { chatName }
        </h1>
        <div className="flex">
          <Button
            handleClick={handleHideChat}
            isLink
          >
            Hide chat
          </Button>
        </div>
      </div>
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
          <div className="flex direction-column messages">
            { messages.length > 0 && messages.map(
              (message: UserMessage): React.ReactNode => (
                <div
                  className="flex direction-column mt-1"
                  key={message.id}
                >
                  <div>
                    { `${message.login === login ? 'You' : message.login} wrote:` }
                  </div>
                  <div>
                    { message.text }
                  </div>
                </div>
              ),
            ) }
            <div ref={scrollRef} />
          </div>
          <form
            className="flex direction-column mt-1"
            onSubmit={handleSendMessage}
          >
            <Input
              handleInput={handleInput}
              name="messageInput"
              placeholder="Message"
              value={messageInput}
            />
            <Button
              classes={['mt-1']}
              isSubmit
            >
              Send
            </Button>
            <div className="flex justify-center">
              <Button
                classes={['mt-1']}
                handleClick={(): void => navigate(`/${ROUTING.home}`)}
                isLink
              >
                Back
              </Button>
            </div>
          </form>
        </>
      ) }
    </div>
  );
}

export default memo(Chat);
