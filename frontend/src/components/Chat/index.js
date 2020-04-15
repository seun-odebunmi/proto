import React from 'react';
import PropTypes from 'prop-types';

import Empty from './Empty';
import ChatWindow from './ChatWindow';

const Chat = ({ user, chatStatus, handleChatStart, ...rest }) => {
  return (
    <main className="Main">
      {!chatStatus ? (
        <Empty user={user} handleChatStart={handleChatStart} />
      ) : (
        <ChatWindow user={user} {...rest} />
      )}
    </main>
  );
};

Chat.propTypes = {
  user: PropTypes.object,
  chatStatus: PropTypes.bool,
  handleChatStart: PropTypes.func,
};

export default Chat;
