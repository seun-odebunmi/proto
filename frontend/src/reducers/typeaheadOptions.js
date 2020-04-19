import { SET_TYPEAHEAD_OPTIONS, SEND_MESSAGE } from '../actions/types';

export default (state = [], action) => {
  switch (action.type) {
    case SET_TYPEAHEAD_OPTIONS: {
      return action.payload;
    }
    case SEND_MESSAGE: {
      return [];
    }
    default:
      return state;
  }
};
