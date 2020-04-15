import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { initBotApi, replyBotApi } from '../../api';
import {
  setChatStatus,
  setTypingValue,
  botReply,
  sendMessage,
  setBotTypingStatus,
  setTypeaheadOptions,
} from '../../actions';

import Layout from '../../components/Shared/Layout';
import ChatComponent from '../../components/Chat';

class Chat extends Component {
  constructor(props) {
    super(props);
    this.handleChatStart = this.handleChatStart.bind(this);
    this.handleOnChange = this.handleOnChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.chatsRef = React.createRef();
  }

  componentDidMount() {
    const { user, messages } = this.props;
    if (messages.length === 0) {
      initBotApi(user.name).then((res) => {
        if (res) {
          this.props.botReply(res.msg);
        }
      });
    }
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
      setTypeaheadOptions,
    } = this.props;
    const value = typeof typing !== 'string' ? `${typing[0].value}, ${typing[0].key}` : typing;

    sendMessage(value);
    this.scrollToBottom();
    setBotTypingStatus(true);

    replyBotApi(value, user.name).then((res) => {
      if (res) {
        setBotTypingStatus(false);
        botReply(res.msg, res.file);
        setTypeaheadOptions(res.taOptions || null);
        this.scrollToBottom();
      }
    });
  }

  handleChatStart() {
    this.props.setChatStatus(true);
  }

  render() {
    const { history } = this.props;

    return (
      <Layout history={history}>
        <div className="Chat-container">
          <ChatComponent
            {...this.props}
            chatsRef={this.chatsRef}
            handleChatStart={this.handleChatStart}
            handleOnChange={this.handleOnChange}
            handleSubmit={this.handleSubmit}
          />
        </div>
      </Layout>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    ...state,
  };
};

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      setChatStatus,
      setTypingValue,
      botReply,
      sendMessage,
      setBotTypingStatus,
      setTypeaheadOptions,
    },
    dispatch
  );

Chat.propTypes = {
  typing: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  user: PropTypes.object,
  setChatStatus: PropTypes.func,
  setTypingValue: PropTypes.func,
  botReply: PropTypes.func,
  sendMessage: PropTypes.func,
  setBotTypingStatus: PropTypes.func,
  setTypeaheadOptions: PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
