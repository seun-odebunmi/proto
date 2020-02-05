import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import store from './store';
import App from './containers/App';
import './index.css';

console.log('%c Rendered with 👉 👉👇', 'background: purple; color: #FFF', store.getState());

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
