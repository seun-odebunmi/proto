import { SET_BOT_TYPING_STATUS } from '../constants/action-types';

export default (state = false, action) => {
  switch (action.type) {
    case SET_BOT_TYPING_STATUS:
      return action.payload;
    default:
      return state;
  }
};
