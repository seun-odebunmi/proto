import { BOT_REPLY, SEND_MESSAGE, SET_CHAT_STATUS } from '../actions/types';

export default (state = [], action) => {
  switch (action.type) {
    case BOT_REPLY: {
      return [...state, action.payload];
    }
    case SEND_MESSAGE: {
      return [...state, action.payload];
    }
    case SET_CHAT_STATUS: {
      if (action.payload === false) {
        return [];
      }
      return [...state];
    }
    default:
      return state;
  }
};
