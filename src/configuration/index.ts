export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const CHAT_TYPES = {
  group: 'group',
  private: 'private',
};

export const COLORS = {
  accent: '#6210f1',
  accentLight: '#9050ff',
  muted: '#AAAAAA',
  text: '#FCFCFC',
};

export const ERROR_MESSAGES = {
  accessDenied: 'Access denied!',
  accountSuspended: 'Account suspended!',
  chatNotFound: 'Could not find requested chat!',
  currentPasswordIsInvalid: 'Current password is invalid!',
  generic: 'Something went wrong',
  loginShouldBeAlphanumeric: 'Login should be alphanumeric!',
  loginAlreadyInUse: 'Login is already in use!',
  loginIsTooLong: 'Login is too long!',
  missingRequiredData: 'Missing required data!',
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
  DELETE_ACCOUNT: 'delete-account',
  DEVICE_CONNECTED: 'device-connected',
  DEVICE_DISCONNECTED: 'device-disconnected',
  FIND_USERS: 'find-users',
  GET_CHAT: 'get-chat',
  GET_CHAT_MESSAGES: 'get-chat-messages',
  GET_CHATS: 'get-chats',
  GET_CONNECTED_DEVICES: 'get-connected-devices',
  HIDE_CHAT: 'hide-chat',
  INCOMING_CHAT_MESSAGE: 'incoming-chat-message',
  INCOMING_LATEST_MESSAGE: 'incoming-latest-message',
  JOIN_ROOM: 'join-room',
  LEAVE_ROOM: 'leave-room',
  LOGOUT: 'logout',
  RECOVERY_FINAL_STAGE: 'recovery-final-stage',
  RECOVERY_INITIAL_STAGE: 'recovery-inital-stage',
  ROOM_DELETE_MESSAGE: 'room-delete-message',
  ROOM_UPDATE_MESSAGE: 'room-update-message',
  SEND_MESSAGE: 'send-message',
  SIGN_IN: 'sign-in',
  SIGN_UP: 'sign-up',
  UPDATE_PASSWORD: 'update-password',
  UPDATE_RECOVERY_DATA: 'update-recovery-data',
  USER_CONNECTED: 'user-connected',
  USER_DISCONNECTED: 'user-disconnected',
};

export const MAX_DEVICE_NAME_LENGTH = 64;

export const MAX_LOGIN_LENGTH = 32;

export const MAX_PASSWORD_LENGTH = 32;

export const MAX_RECOVERY_ANSWER_LENGTH = 255;

export const MAX_RECOVERY_QUESTION_LENGTH = 255;

export const MIN_PASSWORD_LENGTH = 8;

export const PAGINATION_DEFAULTS = {
  currentPage: 1,
  limit: 100,
  totalCount: 0,
  totalPages: 1,
};

export const RESPONSE_MESSAGES = {
  INVALID_CHAT_ID: 'INVALID_CHAT_ID',
  LOGIN_ALREADY_IN_USE: 'LOGIN_ALREADY_IN_USE',
  MISSING_DATA: 'MISSING_DATA',
  OLD_PASSWORD_IS_INVALID: 'OLD_PASSWORD_IS_INVALID',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
};

export const ROLES = {
  admin: 'admin',
  user: 'user',
};

export const SPACER = 16;
