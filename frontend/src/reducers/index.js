import { combineReducers } from 'redux';
import { DESTROY_SESSION } from '../actions/types';

import user from './users';
import chatStatus from './chatStatus';
import diagnosisStatus from './diagnosisStatus';
import typing from './typing';
import messages from './messages';
import botTypingStatus from './botTypingStatus';
import typeaheadOptions from './typeaheadOptions';

const appReducer = combineReducers({
  chatStatus,
  diagnosisStatus,
  user,
  typing,
  messages,
  botTypingStatus,
  typeaheadOptions,
});

const rootReducer = (state, action) => {
  // Clear all data in redux store to initial.
  if (action.type === DESTROY_SESSION) state = undefined;

  return appReducer(state, action);
};

export default rootReducer;
