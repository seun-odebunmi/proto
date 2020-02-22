import { BOT_REPLY, SEND_MESSAGE } from '../constants/action-types';

export default (state = [], action) => {
  switch (action.type) {
    case BOT_REPLY: {
      return [...state, action.payload];
    }
    case SEND_MESSAGE: {
      return [...state, action.payload];
    }
    default:
      return state;
  }
};
