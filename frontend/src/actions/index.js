import {
  SET_CHAT_STATUS,
  SET_BOT_TYPING_STATUS,
  SET_TYPING_VALUE,
  BOT_REPLY,
  SEND_MESSAGE,
  SET_TYPEAHEAD_OPTIONS,
  LOGIN_USER,
} from '../constants/action-types';

export const setChatStatus = (value) => ({
  type: SET_CHAT_STATUS,
  payload: value,
});

export const setBotTypingStatus = (value) => ({
  type: SET_BOT_TYPING_STATUS,
  payload: value,
});

export const setTypingValue = (value) => ({
  type: SET_TYPING_VALUE,
  payload: value,
});

export const setTypeaheadOptions = (value) => ({
  type: SET_TYPEAHEAD_OPTIONS,
  payload: value,
});

export const botReply = (message, file) => ({
  type: BOT_REPLY,
  payload: { text: message, file, is_user_msg: false },
});

export const sendMessage = (message) => ({
  type: SEND_MESSAGE,
  payload: { text: message, is_user_msg: true },
});

export const loginUser = (user) => ({ type: LOGIN_USER, payload: user });
