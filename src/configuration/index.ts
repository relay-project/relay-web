export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const ERROR_MESSAGES = {
  accessDenied: 'Access denied!',
  accountSuspended: 'Account suspended!',
  currentPasswordIsInvalid: 'Current password is invalid!',
  generic: 'Something went wrong',
  loginShouldBeAlphanumeric: 'Login should be alphanumeric!',
  loginAlreadyInUse: 'Login is already in use!',
  loginIsTooLong: 'Login is too long!',
  passwordConfirmationIsInvalid: 'Password confirmation is invalid!',
  passwordIsTooLong: 'Password is too long!',
  passwordIsTooShort: 'Password should be at least 8 symbols long!',
  pleaseProvideTheData: 'Please provide required data!',
  providedDataIsInvalid: 'Provided data is invalid!',
  recoveryAnswerIsTooLong: 'Recovery answer is too long!',
  recoveryQuestionIsTooLong: 'Recovery question is too long!',
};

export const EVENTS = {
  COMPLETE_LOGOUT: 'complete-logout',
  CONNECT: 'connect',
  CREATE_CHAT: 'create-chat',
  FIND_USERS: 'find-users',
  GET_CHAT: 'get-chat',
  GET_CHAT_MESSAGES: 'get-chat-messages',
  GET_CHATS: 'get-chats',
  DELETE_ACCOUNT: 'delete-account',
  RECOVERY_FINAL_STAGE: 'recovery-final-stage',
  RECOVERY_INITIAL_STAGE: 'recovery-inital-stage',
  SIGN_IN: 'sign-in',
  SIGN_UP: 'sign-up',
  UPDATE_PASSWORD: 'update-password',
  UPDATE_RECOVERY_DATA: 'update-recovery-data',
};

export const MAX_DEVICE_NAME_LENGTH = 64;

export const MAX_LOGIN_LENGTH = 32;

export const MAX_PASSWORD_LENGTH = 32;

export const MAX_RECOVERY_ANSWER_LENGTH = 255;

export const MAX_RECOVERY_QUESTION_LENGTH = 255;

export const MIN_PASSWORD_LENGTH = 8;

export const RESPONSE_MESSAGES = {
  LOGIN_ALREADY_IN_USE: 'LOGIN_ALREADY_IN_USE',
  OLD_PASSWORD_IS_INVALID: 'OLD_PASSWORD_IS_INVALID',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
};

export const ROLES = {
  admin: 'admin',
  user: 'user',
};
