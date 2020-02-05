import React from 'react';
import PropTypes from 'prop-types';

import Empty from '../Empty';
import ChatWindow from '../ChatWindow';

const Main = ({ user, activeUserId, ...rest }) => {
  return (
    <main className="Main">
      {!activeUserId ? <Empty user={user} activeUserId={activeUserId} /> : <ChatWindow {...rest} />}
    </main>
  );
};

Main.propTypes = {
  user: PropTypes.object,
  activeUserId: PropTypes.string
};

export default Main;
