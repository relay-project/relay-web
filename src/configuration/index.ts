export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const ERROR_MESSAGES = {
  accessDenied: 'Access denied!',
  accountSuspended: 'Account suspended!',
  generic: 'Something went wrong',
  pleaseProvideTheData: 'Please provide required data!',
  providedDataIsInvalid: 'Provided data is invalid!',
};

export const EVENTS = {
  COMPLETE_LOGOUT: 'complete-logout',
  CONNECT: 'connect',
  SIGN_IN: 'sign-in',
  SIGN_UP: 'sign-up',
  UPDATE_PASSWORD: 'update-password',
  UPDATE_RECOVERY_DATA: 'update-recovery-data',
};

export const MAX_LOGIN_LENGTH = 32;

export const MAX_PASSWORD_LENGTH = 32;

export const MAX_RECOVERY_ANSWER_LENGTH = 255;

export const MAX_RECOVERY_QUESTION_LENGTH = 255;

export const MIN_PASSWORD_LENGTH = 8;

export const RESPONSE_MESSAGES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
};

export const ROLES = {
  admin: 'admin',
  user: 'user',
};
