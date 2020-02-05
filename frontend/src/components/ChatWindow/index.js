import React from 'react';
import PropTypes from 'prop-types';

const ChatWindow = ({ activeUser, chatsRef }) => {
  return (
    <div className="ChatWindow">
      <header className="Header flex flex-row items-center">
        <img src={activeUser.profile_pic} alt={activeUser.name} className="br-pill h-100" />
        <h2 className="Header__name flex-auto ml3">{activeUser.name}</h2>
      </header>
      <div className="Chats" ref={chatsRef}></div>
      <form className="Message flex flex-column items-center">
        <input className="Message__input" placeholder="Write a message" />
      </form>
    </div>
  );
};

ChatWindow.propTypes = {
  activeUser: PropTypes.object,
  chatsRef: PropTypes.object
};

export default ChatWindow;
