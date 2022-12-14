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
  PAGINATION_DEFAULTS,
  RESPONSE_MESSAGES,
} from '../../configuration';
import { type Response, SocketContext } from '../../contexts/socket.context';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import useRedirect from '../../hooks/use-redirect';
import type {
  ChatModel,
  MessageModel,
  Pagination,
} from '../../types/models';
import { ChatUser, setLatestMessage } from '../../store/features/chat-list.slice';
import { ROUTING } from '../../router';
import Spinner from '../../components/spinner';
import Input from '../../components/input';
import Button from '../../components/button';
import './styles.css';

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

  const [chatData, setChatData] = useState<ChatModel | null>(null);
  const [chatMessagesLoading, setChatMessagesLoading] = useState<boolean>(true);
  const [chatUsers, setChatUsers] = useState<ChatUser[]>([]);
  const [error, setError] = useState<string>('');
  const [messages, setMessages] = useState<UserMessage[]>([]);
  const [messageInput, setMessageInput] = useState<string>('');
  const [pagination, setPagination] = useState<Pagination>(PAGINATION_DEFAULTS);

  const [entry = null] = useAppSelector(
    (state) => state.chatList.chats.filter(
      (chat): boolean => chat.id === Number(params.id),
    ),
  );
  const { isLoading: chatsLoading } = useAppSelector((state) => state.chatList);

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
            (user): boolean => user.id !== id,
          );
          if (!anotherUser) {
            return 'Chat';
          }
          return `Chat with ${anotherUser.login} (${anotherUser.isOnline
            ? 'online'
            : 'offline'})`;
        }
        const loginList = chatUsers.reduce(
          (array: string[], user): string[] => {
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
    [
      chatData,
      messages,
    ],
  );

  const handleGetChatMessagesResponse = (
    response: Response<GetMessagesPayload>,
  ): void => {
    setChatMessagesLoading(false);

    if (response.status > 299) {
      const { info } = response;
      if (info === RESPONSE_MESSAGES.VALIDATION_ERROR) {
        return setError(ERROR_MESSAGES.providedDataIsInvalid);
      }
      if (info === RESPONSE_MESSAGES.INVALID_CHAT_ID) {
        return setError(ERROR_MESSAGES.chatNotFound);
      }
      return setError(ERROR_MESSAGES.generic);
    }

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
    },
    [chatData],
  );

  const handleHideChatResponse = (response: Response): void => {
    if (response.status > 299) {
      const { info } = response;
      if (info === RESPONSE_MESSAGES.VALIDATION_ERROR) {
        return setError(ERROR_MESSAGES.providedDataIsInvalid);
      }
      if (info === RESPONSE_MESSAGES.INVALID_CHAT_ID) {
        return setError(ERROR_MESSAGES.chatNotFound);
      }
      return setError(ERROR_MESSAGES.generic);
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

  const handleIncomingMessage = useCallback(
    (message: UserMessage): void => {
      dispatch(setLatestMessage({
        chatId: message.chatId,
        message: {
          authorId: message.authorId,
          authorLogin: message.login,
          createdAt: message.createdAt,
          text: message.text,
        },
        newMessages: 0,
      }));
      return setMessages(
        (state: UserMessage[]): UserMessage[] => [
          ...state,
          message,
        ],
      );
    },
    [chatData],
  );

  useEffect(
    (): (() => void) => {
      connection.on(EVENTS.GET_CHAT_MESSAGES, handleGetChatMessagesResponse);
      connection.on(EVENTS.HIDE_CHAT, handleHideChatResponse);
      connection.on(EVENTS.INCOMING_CHAT_MESSAGE, handleIncomingMessage);
      connection.on(EVENTS.SEND_MESSAGE, handleSendMessageResponse);

      connection.emit(
        EVENTS.GET_CHAT_MESSAGES,
        {
          limit: pagination.limit,
          chatId: params.id,
          page: pagination.currentPage,
          token,
        },
      );

      connection.emit(
        EVENTS.JOIN_ROOM,
        {
          chatId: params.id,
          token,
        },
      );

      return (): void => {
        connection.off(EVENTS.GET_CHAT_MESSAGES, handleGetChatMessagesResponse);
        connection.off(EVENTS.HIDE_CHAT, handleHideChatResponse);
        connection.off(EVENTS.INCOMING_CHAT_MESSAGE, handleIncomingMessage);
        connection.off(EVENTS.SEND_MESSAGE, handleSendMessageResponse);

        connection.emit(
          EVENTS.LEAVE_ROOM,
          {
            chatId: params.id,
            token,
          },
        );
      };
    },
    [],
  );

  useEffect(
    (): void => {
      if (!entry) {
        if (!chatsLoading) {
          setError(ERROR_MESSAGES.chatNotFound);
        }
      } else {
        const { users, ...rest } = entry;
        setChatData(rest);
        setChatUsers(users);
        setError('');
      }
    },
    [
      chatsLoading,
      entry,
    ],
  );

  return (
    <div>
      { chatsLoading && (
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
      { error && (
        <div className="mt-1 text-center">
          { error }
        </div>
      )}
      { !error && chatMessagesLoading && (
        <div>
          Loading messages
        </div>
      ) }
      { !error && !chatMessagesLoading && (
        <>
          { messages.length === 0 && (
            <div>
              No messages yet
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
