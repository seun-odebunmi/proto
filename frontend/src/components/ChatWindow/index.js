import React from 'react';
import PropTypes from 'prop-types';

import Input from './input';

const ChatWindow = ({ user, messages, botTypingStatus, chatsRef, ...rest }) => {
  const { name, profile_pic } = user;

  return (
    <div className="ChatWindow">
      <header className="Header flex flex-row items-center">
        <img src={profile_pic} alt={name} className="br-pill h-100" />
        <h2 className="Header__name flex-auto ml3">{name}</h2>
      </header>
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
      <Input {...rest} />
    </div>
  );
};

ChatWindow.propTypes = {
  user: PropTypes.object,
  messages: PropTypes.array,
  botTypingStatus: PropTypes.bool,
  chatsRef: PropTypes.object
};

export default ChatWindow;
