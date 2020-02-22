import { combineReducers } from 'redux';

import user from './users';
import chatStatus from './chatStatus';
import typing from './typing';
import messages from './messages';
import botTypingStatus from './botTypingStatus';
import typeaheadOptions from './typeaheadOptions';

export default combineReducers({
  chatStatus,
  user,
  typing,
  messages,
  botTypingStatus,
  typeaheadOptions
});
