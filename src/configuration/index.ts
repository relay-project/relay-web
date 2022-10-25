export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const EVENTS = {
  COMPLETE_LOGOUT: 'complete-logout',
  CONNECT: 'connect',
  SIGN_IN: 'sign-in',
  SIGN_UP: 'sign-up',
  UPDATE_PASSWORD: 'update-password',
};

export const MAX_LOGIN_LENGTH = 32;

export const MAX_RECOVERY_ANSWER_LENGTH = 256;

export const MAX_RECOVERY_QUESTION_LENGTH = 256;

export const MIN_PASSWORD_LENGTH = 8;

export const ROLES = {
  admin: 'admin',
  user: 'user',
};
