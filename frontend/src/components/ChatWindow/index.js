import React from 'react'
import _ from 'lodash'

import store from '../../store'
import Header from './header'
import Chats from './chats'
import MessageInput from '../../containers/MessageInput'

import './ChatWindow.css'

const ChatWindow = ({ activeUserId }) => {
  const state = store.getState()
  const activeUser = state.contacts[activeUserId]
  const activeMsgs = state.messages[activeUserId]
  const { typing } = state

  let bot = new RiveScript();

const message_container = document.querySelector('.Chats');
const form = document.querySelector('form');
const input_box = document.querySelector('input');

const brains = [
  'https://gist.githubusercontent.com/awesammcoder/91e0f6c527bfdc03b8815289ca4af150/raw/6410ce00b7e1ea0dbd28be03b6eaab64252a841d/brain.rive'
];

bot.loadFile(brains).then(botReady).catch(botNotReady);

form.addEventListener('submit', (e) => {
  e.preventDefault();
  selfReply(input_box.value);
  input_box.value = '';
});

function botReply(message){
  message_container.innerHTML += `<div class="bot">${message}</div>`;
  // location.href = '#edge';
}

function selfReply(message){
  message_container.innerHTML += `<div class="self">${message}</div>`;
  // location.href = '#edge';
  
  bot.reply("local-user", message).then(function(reply) {
    botReply(reply);
  });
}

function botReady(){
  bot.sortReplies();
  botReply('Hello');
}

function botNotReady(err){
  console.log("An error has occurred.", err);
}

  return (
    <div className="ChatWindow">
      <Header user={activeUser} />
      <Chats messages={_.values(activeMsgs)} />
      <MessageInput value={typing} />
    </div>
  )
}

export default ChatWindow
