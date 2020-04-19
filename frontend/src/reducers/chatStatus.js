import { SET_CHAT_STATUS } from '../actions/types';

export default function chatStatus(state = false, action) {
  switch (action.type) {
    case SET_CHAT_STATUS:
      return action.payload;
    default:
      return state;
  }
}
