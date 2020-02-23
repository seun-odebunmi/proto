import React from 'react';
import PropTypes from 'prop-types';

const Messages = ({ messages, botTypingStatus, chatsRef }) => {
  return (
    <div className="Chats" ref={chatsRef}>
      {messages.map(({ text, is_user_msg }, index) => (
        <div className={`Chat ${is_user_msg ? 'is-user-msg' : ''}`} key={index}>
          <p>{is_user_msg ? 'Me' : 'Bot'}</p>
          {text}
        </div>
      ))}
      {botTypingStatus && (
        <div className="Chat">
          <span>.</span>
          <span>.</span>
          <span>.</span>
        </div>
      )}
    </div>
  );
};

Messages.propTypes = {
  messages: PropTypes.array,
  botTypingStatus: PropTypes.bool,
  chatsRef: PropTypes.object
};

export default Messages;
