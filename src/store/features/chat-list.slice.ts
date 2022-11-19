import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type {
  ChatModel,
  MessageModel,
  Pagination,
  UserModel,
} from '../../types/models';
import { PAGINATION_DEFAULTS } from '../../configuration';

export type ChatUser = Pick<UserModel, 'id' | 'login'> & {
  chatId: number;
  isOnline?: boolean;
  joinedChat: string;
};

export type LatestMessage = Pick<MessageModel, 'authorId' | 'createdAt' | 'text'> & {
  authorLogin: string;
};

export interface ChatListEntry extends ChatModel {
  latestMessage: LatestMessage[] | null;
  users: ChatUser[];
}

export interface ChatListState {
  chats: ChatListEntry[];
  dataLoaded: boolean;
  isLoading: boolean;
  pagination: Pagination;
}

const initialState: ChatListState = {
  chats: [],
  dataLoaded: false,
  isLoading: false,
  pagination: PAGINATION_DEFAULTS,
};

export const deviceSlice = createSlice({
  initialState,
  name: 'chatList',
  reducers: {
    addChat: (state, action: PayloadAction<ChatListEntry>): ChatListState => ({
      ...state,
      chats: [...state.chats, action.payload],
    }),
    deleteChat: (state, action: PayloadAction<number>): ChatListState => ({
      ...state,
      chats: state.chats.filter(
        (chat: ChatListEntry): boolean => chat.id !== action.payload,
      ),
    }),
    setChatList: (_, action: PayloadAction<ChatListState>): ChatListState => ({
      ...action.payload,
    }),
    setChats: (state, action: PayloadAction<ChatListEntry[]>): ChatListState => ({
      ...state,
      chats: action.payload,
    }),
    setDataLoaded: (state, action: PayloadAction<boolean>): ChatListState => ({
      ...state,
      dataLoaded: action.payload,
    }),
    setIsLoading: (state, action: PayloadAction<boolean>): ChatListState => ({
      ...state,
      isLoading: action.payload,
    }),
    setPagination: (state, action: PayloadAction<Pagination>): ChatListState => ({
      ...state,
      pagination: action.payload,
    }),
    setUserConnection: (
      state,
      action: PayloadAction<{ isOnline: boolean, userId: number }>,
    ): ChatListState => ({
      ...state,
      chats: state.chats.map((chat: ChatListEntry): ChatListEntry => {
        const { isOnline, userId } = action.payload;
        const updatedUsers = chat.users.map((user: ChatUser): ChatUser => {
          if (user.id === userId) {
            return {
              ...user,
              isOnline,
            };
          }
          return user;
        });
        return {
          ...chat,
          users: updatedUsers,
        };
      }),
    }),
  },
});

export const {
  addChat,
  deleteChat,
  setChatList,
  setChats,
  setDataLoaded,
  setIsLoading,
  setPagination,
  setUserConnection,
} = deviceSlice.actions;

export default deviceSlice.reducer;
