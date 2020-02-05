import React from 'react';
import PropTypes from 'prop-types';

const Empty = ({ user }) => {
  const { name, profile_pic } = user;
  const first_name = name.split(' ')[0];

  return (
    <div className="Empty">
      <h1 className="Empty__name">Welcome, {first_name} </h1>
      <img src={profile_pic} alt={name} className="Empty__img" />
      <p className="Empty__status">
        <b>Status:</b> Online
      </p>
      <button className="Empty__btn">Start a conversation</button>
      <p className="Empty__info">Get diagnosed by chatting with the bot!</p>
    </div>
  );
};

Empty.propTypes = {
  user: PropTypes.object
};

export default Empty;
