import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Sidebar, Menu, Icon } from 'semantic-ui-react';

const LeftNav = ({ visible, children, history, menu, linkAction }) => (
  <Sidebar.Pushable as={'div'} style={{ marginTop: '0px' }}>
    <Sidebar as={Menu} animation="push" visible={visible} vertical>
      <div className="sidebar-container flex flex-column h-100">
        <div className="navSection">
          <div className="flex flex-column justify-start">
            {menu.map((link, index) => (
              <Fragment key={index}>
                <Menu>
                  <Menu.Item
                    name={link.name}
                    className={link.className}
                    onClick={() => linkAction(link.path)}
                    active={history.location.pathname === link.path ? true : false}
                  >
                    <Icon name={link.icon} />
                    <span className="hide-menu ttc">{link.name}</span>
                  </Menu.Item>
                </Menu>
              </Fragment>
            ))}
          </div>
        </div>
      </div>
    </Sidebar>
    <Sidebar.Pusher>
      <div className="contentPage">{children}</div>
    </Sidebar.Pusher>
  </Sidebar.Pushable>
);

LeftNav.propTypes = {
  visible: PropTypes.bool.isRequired,
  menu: PropTypes.array.isRequired,
  children: PropTypes.any.isRequired,
  history: PropTypes.any,
  linkAction: PropTypes.func.isRequired,
};

export default LeftNav;
