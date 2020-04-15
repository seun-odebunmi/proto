import React from 'react';
import PropTypes from 'prop-types';
import { Menu, Dropdown, Input } from 'semantic-ui-react';

const Header = ({ onToggle, logoutAction, linkAction, user }) => {
  return (
    <Menu
      stackable
      secondary
      className="flex menu secondary stackable ui h3"
      style={{
        marginBottom: '0px',
      }}
    >
      {/* <Menu.Item onClick={onToggle}>
        <Icon name="bars" fitted />
      </Menu.Item> */}
      <Menu.Item>
        <Input icon="search" placeholder="Search..." />
      </Menu.Item>
      <Menu.Menu position="right">
        <Dropdown text="" icon="bell outline" simple className="icon">
          <Dropdown.Menu>
            <Dropdown.Header>Notifications</Dropdown.Header>
            <Dropdown.Divider />
            <Dropdown.Item label={{ color: 'red', empty: true, circular: true }} text="Important" />
            <Dropdown.Item
              label={{ color: 'blue', empty: true, circular: true }}
              text="Announcement"
            />
            <Dropdown.Item
              label={{ color: 'black', empty: true, circular: true }}
              text="Discussion"
            />
          </Dropdown.Menu>
        </Dropdown>
        <Dropdown text={user} icon="user circle outline" simple className="icon">
          <Dropdown.Menu>
            <Dropdown.Header>Options</Dropdown.Header>
            <Dropdown.Divider />
            <Dropdown.Item>View Profile</Dropdown.Item>
            <Dropdown.Item onClick={() => linkAction('/ChangePassword')}>
              Change Password
            </Dropdown.Item>
            <Dropdown.Divider />
            <Menu.Item className="red" onClick={logoutAction} name="logout" />
          </Dropdown.Menu>
        </Dropdown>
      </Menu.Menu>
    </Menu>
  );
};

Header.propTypes = {
  onToggle: PropTypes.func,
  user: PropTypes.string,
  logoutAction: PropTypes.func.isRequired,
  linkAction: PropTypes.func.isRequired,
};

export default Header;
