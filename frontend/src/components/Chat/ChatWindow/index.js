import React from 'react';
import PropTypes from 'prop-types';

import Messages from './messages';
import Input from './input';

import botImg from '../../../assets/img/bot.png';

const ChatWindow = (props) => {
  return (
    <div className="ChatWindow">
      <header className="Header flex flex-row items-center">
        <img src={botImg} alt="help-bot" className="br-pill h-100" />
        <h2 className="Header__name flex-auto ml3">Help Bot</h2>
      </header>
      <Messages {...props} />
      <Input {...props} />
    </div>
  );
};

ChatWindow.propTypes = {
  user: PropTypes.object,
};

export default ChatWindow;
