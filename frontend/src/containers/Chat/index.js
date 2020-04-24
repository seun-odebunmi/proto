import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { initBotApi, replyBotApi } from '../../api';
import {
  setChatStatus,
  setDiagnosisCompleteStatus,
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
    this.handleChartEnd = this.handleChartEnd.bind(this);
    this.chatsRef = React.createRef();
  }

  componentDidMount() {
    const { user } = this.props;
    const token = localStorage.getItem('token');

    if (!token) {
      this.props.history.replace('/login');
    } else {
      if (user.userType_id !== 1) {
        this.props.history.replace('/Recommendation');
      }
    }
  }

  componentDidUpdate() {
    const {
      user,
      messages,
      botReply,
      setTypeaheadOptions,
      setDiagnosisCompleteStatus,
    } = this.props;
    const input_box = document.querySelector('.Message__input');

    if (messages.length === 0) {
      initBotApi(user.name).then((res) => {
        if (res) {
          botReply(res.msg);
          setDiagnosisCompleteStatus(res.completed);
          setTypeaheadOptions(res.taOptions || null);
        }
      });
    }

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
      setDiagnosisCompleteStatus,
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
        setDiagnosisCompleteStatus(res.completed);
        this.scrollToBottom();
      }
    });
  }

  handleChatStart() {
    this.props.setChatStatus(true);
  }

  handleChartEnd() {
    this.props.setChatStatus(false);
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
            handleChartEnd={this.handleChartEnd}
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
      setDiagnosisCompleteStatus,
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
  setDiagnosisCompleteStatus: PropTypes.func,
  setTypingValue: PropTypes.func,
  botReply: PropTypes.func,
  sendMessage: PropTypes.func,
  setBotTypingStatus: PropTypes.func,
  setTypeaheadOptions: PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
