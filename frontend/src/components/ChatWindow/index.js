import React from 'react';
import PropTypes from 'prop-types';

import Messages from './messages';
import Input from './input';

const ChatWindow = ({ user, ...rest }) => {
  const { name, profile_pic } = user;

  return (
    <div className="ChatWindow">
      <header className="Header flex flex-row items-center">
        <img src={profile_pic} alt={name} className="br-pill h-100" />
        <h2 className="Header__name flex-auto ml3">{name}</h2>
      </header>
      <Messages {...rest} />
      <Input {...rest} />
    </div>
  );
};

ChatWindow.propTypes = {
  user: PropTypes.object
};

export default ChatWindow;
