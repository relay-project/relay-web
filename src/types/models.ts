interface Base {
  createdAt?: string;
  id: number;
  updatedAt?: string;
}

export interface ChatModel extends Base {
  createdBy: number;
  name: string;
  type: string;
}

export type Roles = 'admininstrator' | 'user';

export interface UserModel extends Base {
  failedLoginAttempts?: number;
  login: string;
  recoveryAnswer?: string;
  recoveryQuestion?: string;
  role?: Roles;
}
