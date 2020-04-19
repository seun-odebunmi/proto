import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import FeatherIcon from 'feather-icons-react';

const LeftNav = ({ history, menu, user }) => (
  <div id="layoutSidenav_nav">
    <nav className="sidenav shadow-right sidenav-dark">
      <div className="sidenav-menu">
        <div className="nav accordion" id="accordionSidenav">
          <div className="sidenav-menu-heading">Menu</div>
          {menu.map(({ path, name, icon }, index) => (
            <Link
              to={path}
              className={`nav-link${path === history.location.pathname ? ' active' : ''}`}
              key={index}
            >
              <div className="nav-link-icon">
                <FeatherIcon icon={icon} />
              </div>
              {name}
            </Link>
          ))}
        </div>
      </div>
      <div className="sidenav-footer">
        <div className="sidenav-footer-content">
          <div className="sidenav-footer-subtitle">Logged in as:</div>
          <div className="sidenav-footer-title">{user.name}</div>
        </div>
      </div>
    </nav>
  </div>
);

LeftNav.propTypes = {
  menu: PropTypes.array.isRequired,
  user: PropTypes.object.isRequired,
  history: PropTypes.any,
};

export default LeftNav;
