import React from 'react';
import PropTypes from 'prop-types';

const Sidebar = ({ contacts, handleUserClick }) => {
  return (
    <aside className="Sidebar">
      {contacts.map(({ user_id, name }) => (
        <div className="User" onClick={() => handleUserClick(user_id)} key={user_id}>
          <div className="User__details">
            <p className="User__details-name">{name}</p>
          </div>
        </div>
      ))}
    </aside>
  );
};

Sidebar.propTypes = {
  contacts: PropTypes.array,
  handleUserClick: PropTypes.func
};

export default Sidebar;
