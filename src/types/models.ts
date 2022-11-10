interface Base {
  createdAt?: string;
  id: number;
  updatedAt?: string;
}

export type ChatTypes = 'group' | 'private';

export interface ChatModel extends Base {
  createdBy: number;
  name: string;
  type: ChatTypes;
}

export interface MessageModel extends Base {
  authorId: number;
  chatId: number;
  edited: boolean;
  text: string;
}

export interface Pagination {
  currentPage: number;
  limit?: number;
  totalCount: number;
  totalPages: number;
}

export type Roles = 'admin' | 'user';

export interface UserModel extends Base {
  failedLoginAttempts?: number;
  login: string;
  recoveryAnswer?: string;
  recoveryQuestion?: string;
  role?: Roles;
}
