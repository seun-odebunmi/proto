import React from 'react';
import { Link } from 'react-router-dom';
import FeatherIcon from 'feather-icons-react';
import PropTypes from 'prop-types';

const Header = ({ onToggle, logoutAction, user, userDropdown, userDropdownToggle }) => {
  return (
    <nav className="topnav navbar navbar-expand shadow navbar-dark bg-black-40">
      <Link className="navbar-brand d-none d-sm-block active" to="/admin">
        Med-Pro
      </Link>
      <button
        className="btn btn-icon btn-transparent-light order-1 order-lg-0 mr-lg-2"
        id="sidebarToggle"
        onClick={onToggle}
      >
        <FeatherIcon icon="menu" />
      </button>
      <ul className="navbar-nav align-items-center ml-auto">
        <li
          className={`nav-item dropdown no-caret mr-3 dropdown-user${userDropdown ? ' show' : ''}`}
        >
          <a
            className="btn btn-icon btn-transparent-dark dropdown-toggle"
            id="navbarDropdownUserImage"
            href="#!"
            onClick={userDropdownToggle}
          >
            <img className="img-fluid" src={user.profile_pic} alt={user.profile_pic} />
          </a>
          <div
            className={`dropdown-menu dropdown-menu-right border-0 shadow animated--fade-in-up${
              userDropdown ? ' show' : ''
            }`}
          >
            <h6 className="dropdown-header d-flex align-items-center">
              <img className="dropdown-user-img" alt={user.profile_pic} src={user.profile_pic} />
              <div className="dropdown-user-details">
                <div className="dropdown-user-details-name">{user.name}</div>
                <div className="dropdown-user-details-email">{user.username}</div>
              </div>
            </h6>
            <div className="dropdown-divider"></div>
            <a className="dropdown-item" href="#!">
              <div className="dropdown-item-icon">
                <FeatherIcon icon="settings" />
              </div>
              Account
            </a>
            <a className="dropdown-item" href="#!" onClick={logoutAction}>
              <div className="dropdown-item-icon">
                <FeatherIcon icon="log-out" />
              </div>
              Logout
            </a>
          </div>
        </li>
      </ul>
    </nav>
  );
};

Header.propTypes = {
  onToggle: PropTypes.func.isRequired,
  userDropdownToggle: PropTypes.func.isRequired,
  userDropdown: PropTypes.bool.isRequired,
  user: PropTypes.object,
  logoutAction: PropTypes.func.isRequired,
};

export default Header;
