import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { initBotApi, replyBotApi } from '../constants/apis';
import {
  setChatStatus,
  setTypingValue,
  botReply,
  sendMessage,
  setBotTypingStatus,
  setTypeaheadOptions
} from '../actions';

// import Sidebar from '../components/Layout/Sidebar';
import Main from '../components/Layout/Main';

class App extends Component {
  constructor(props) {
    super(props);
    this.handleChatStart = this.handleChatStart.bind(this);
    this.handleOnChange = this.handleOnChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.chatsRef = React.createRef();
  }

  componentDidMount() {
    const { user } = this.props;
    initBotApi(user.name).then(res => {
      this.props.botReply(res.data.msg);
    });
  }

  componentDidUpdate() {
    const input_box = document.querySelector('.Message__input');
    if (input_box != null) {
      input_box.focus();
    }
  }

  scrollToBottom() {
    this.chatsRef.current.scrollTop = this.chatsRef.current.scrollHeight;
  }

  handleOnChange(value) {
    this.props.setTypingValue(value);
  }

  handleSubmit(e) {
    e.preventDefault();
    const {
      sendMessage,
      typing,
      botReply,
      setBotTypingStatus,
      user,
      setTypeaheadOptions
    } = this.props;
    const value =
      typeof typing !== 'string' ? `${typing[0].key} value is ${typing[0].value}` : typing;

    sendMessage(value);
    this.scrollToBottom();
    setBotTypingStatus(true);

    replyBotApi(value, user.name).then(res => {
      setBotTypingStatus(false);
      botReply(res.data.msg);
      setTypeaheadOptions(res.data.taOptions);
      this.scrollToBottom();
    });
  }

  handleChatStart() {
    this.props.setChatStatus(true);
  }

  render() {
    return (
      <div className="App">
        {/* <Sidebar /> */}
        <Main
          {...this.props}
          chatsRef={this.chatsRef}
          handleChatStart={this.handleChatStart}
          handleOnChange={this.handleOnChange}
          handleSubmit={this.handleSubmit}
        />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.user,
    typing: state.typing,
    chatStatus: state.chatStatus,
    messages: state.messages,
    botTypingStatus: state.botTypingStatus,
    typeaheadLoading: state.typeaheadLoading,
    typeaheadOptions: state.typeaheadOptions
  };
};

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      setChatStatus,
      setTypingValue,
      botReply,
      sendMessage,
      setBotTypingStatus,
      setTypeaheadOptions
    },
    dispatch
  );

App.propTypes = {
  typing: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  user: PropTypes.object,
  setChatStatus: PropTypes.func,
  setTypingValue: PropTypes.func,
  botReply: PropTypes.func,
  sendMessage: PropTypes.func,
  setBotTypingStatus: PropTypes.func,
  setTypeaheadOptions: PropTypes.func
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
