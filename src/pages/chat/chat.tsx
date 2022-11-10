import React, {
  memo,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { EVENTS } from '../../configuration';
import { type Response, SocketContext } from '../../contexts/socket.context';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import useRedirect from '../../hooks/use-redirect';
import { ChatModel, UserModel } from '../../types/models';

interface GetChatPayload extends ChatModel {
  users: UserModel[];
}

function Chat(): React.ReactElement {
  useRedirect();

  const connection = useContext(SocketContext);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const params = useParams();

  const [chatLoading, setChatLoading] = useState<boolean>(true);
  const [chatMessagesLoading, setChatMessagesLoading] = useState<boolean>(true);
  const [subscribed, setSubscribed] = useState<boolean>(false);

  const { token } = useAppSelector((state) => state.user);

  const handleGetChatResponse = (response: Response<GetChatPayload>): void => {
    setChatLoading(false);
    console.log(response?.payload);
  };

  const handleGetChatMessagesResponse = (response: Response): void => {
    setChatMessagesLoading(false);
    console.log(response);
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
        connection.emit(
          EVENTS.GET_CHAT,
          {
            chatId: params.id,
            token,
          },
        );
        // connection.emit(
        //   EVENTS.GET_CHAT_MESSAGES,
        //   {
        //     chatId: params.id,
        //     token,
        //   },
        // );
      }
    },
    [subscribed],
  );

  return (
    <div>
      <h1>
        Chat
      </h1>
      { chatLoading && (
        <div>
          Loading chat data
        </div>
      ) }
      { !chatLoading && (
        <div>
          Loaded chat data
        </div>
      ) }
      { !chatLoading && !chatMessagesLoading && (
        <div>
          Loaded messages
        </div>
      ) }
    </div>
  );
}

export default memo(Chat);
