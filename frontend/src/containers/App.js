import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import _ from 'lodash';
import RiveScript from 'rivescript';

import { setActiveUserId, setTypingValue, sendMessage } from '../actions';

import Sidebar from '../components/Layout/Sidebar';
import Main from '../components/Layout/Main';

class App extends Component {
  constructor(props) {
    super(props);
    this.handleUserClick = this.handleUserClick.bind(this);
    this.chatsRef = React.createRef();
  }

  componentDidUpdate() {
    let bot = new RiveScript();

    const message_container = document.querySelector('.Chats');
    const form = document.querySelector('.Message');
    const input_box = document.querySelector('.Message__input');
    input_box.focus();

    const brains = [
      'https://gist.githubusercontent.com/awesammcoder/91e0f6c527bfdc03b8815289ca4af150/raw/6410ce00b7e1ea0dbd28be03b6eaab64252a841d/brain.rive'
    ];

    bot
      .loadFile(brains)
      .then(botReady)
      .catch(botNotReady);

    form.addEventListener('submit', e => {
      e.preventDefault();
      selfReply(input_box.value);
      input_box.value = '';
    });

    const botReply = message => {
      message_container.innerHTML += `<div class="Chat">${message}</div>`;
      this.scrollToBottom();
    };

    const selfReply = message => {
      message_container.innerHTML += `<div class="Chat is-user-msg">${message}</div>`;
      this.scrollToBottom();

      bot.reply('local-user', message).then(function(reply) {
        botReply(reply);
      });
    };

    function botReady() {
      bot.sortReplies();
      botReply('Hello');
    }

    function botNotReady(err) {
      console.log('An error has occurred.', err);
    }
  }

  scrollToBottom() {
    this.chatsRef.current.scrollTop = this.chatsRef.current.scrollHeight;
  }

  handleUserClick(user_id) {
    this.props.setActiveUserId(user_id);
  }

  render() {
    const { contacts, user, activeUserId } = this.props;
    const activeUser = contacts[activeUserId];

    return (
      <div className="App">
        <Sidebar contacts={_.values(contacts)} handleUserClick={this.handleUserClick} />
        <Main
          activeUserId={activeUserId}
          user={user}
          activeUser={activeUser}
          chatsRef={this.chatsRef}
        />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    contacts: state.contacts,
    user: state.user,
    typing: state.typing,
    activeUserId: state.activeUserId
  };
};

const mapDispatchToProps = dispatch =>
  bindActionCreators({ setActiveUserId, setTypingValue, sendMessage }, dispatch);

App.propTypes = {
  user: PropTypes.object,
  contacts: PropTypes.object,
  typing: PropTypes.string,
  activeUserId: PropTypes.string,
  setActiveUserId: PropTypes.func,
  setTypingValue: PropTypes.func,
  sendMessage: PropTypes.func
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
