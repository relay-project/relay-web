import {
  useCallback,
  useContext,
  useEffect,
} from 'react';

import { EVENTS } from '../configuration';
import type { Pagination } from '../types/models';
import { type Response, SocketContext } from '../contexts/socket.context';
import {
  type ChatListEntry,
  setChatList,
  setIsLoading,
  setUserConnection,
} from '../store/features/chat-list.slice';
import { useAppDispatch, useAppSelector } from '../store/hooks';

interface GetChatsPayload extends Pagination {
  results: ChatListEntry[];
}

interface UserConnectionData {
  userId: number;
}

export default function useChatListEvents(connected: boolean): void {
  const connection = useContext(SocketContext);
  const dispatch = useAppDispatch();

  const { chats, dataLoaded, isLoading } = useAppSelector((state) => state.chatList);
  const { token } = useAppSelector((state) => state.user);

  const handleGetChatsResponse = (response: Response<GetChatsPayload>) => {
    if (response.status > 299) {
      // TODO: handle errors
    }

    const { payload } = response;
    if (!payload) {
      return null;
    }

    const { results, ...rest } = payload;
    return dispatch(setChatList({
      chats: results,
      dataLoaded: true,
      isLoading: false,
      pagination: rest,
    }));
  };

  const handleUserConnection = useCallback(
    (data: UserConnectionData, isOnline = true) => dispatch(
      setUserConnection({ isOnline, userId: data.userId }),
    ),
    [
      chats,
    ],
  );

  useEffect(
    (): (() => void) => {
      if (connected && token) {
        connection.on(EVENTS.GET_CHATS, handleGetChatsResponse);
        connection.on(EVENTS.USER_CONNECTED, handleUserConnection);
        connection.on(
          EVENTS.USER_DISCONNECTED,
          (data) => handleUserConnection(data, false),
        );

        if (!dataLoaded && !isLoading) {
          dispatch(setIsLoading(true));
          connection.emit(EVENTS.GET_CHATS, { token });
        }
      }

      return (): void => {
        connection.off(EVENTS.GET_CHATS, handleGetChatsResponse);
        connection.off(EVENTS.USER_CONNECTED, handleUserConnection);
        connection.off(
          EVENTS.USER_DISCONNECTED,
          (data) => handleUserConnection(data, false),
        );
      };
    },
    [
      connected,
      token,
    ],
  );
}
