import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Header from './header';
import LeftNav from './leftNav';
import { verticalMenu } from './menu';
import { logOut } from '../../../actions';

class Layout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      leftNavOpen: true,
      userDropdown: false,
    };
    this.handleToggle = this.handleToggle.bind(this);
    this.handleUserToggle = this.handleUserToggle.bind(this);
    this.handleLogOut = this.handleLogOut.bind(this);
    this.closeUserToggle = this.closeUserToggle.bind(this);
  }

  handleToggle() {
    this.setState((prevState) => ({ ...prevState, leftNavOpen: !this.state.leftNavOpen }));
  }

  closeUserToggle() {
    this.setState((prevState) => ({ ...prevState, userDropdown: false }));
  }

  handleUserToggle() {
    this.setState((prevState) => ({ ...prevState, userDropdown: !this.state.userDropdown }));
  }

  handleLogOut() {
    const { history, logOut } = this.props;
    localStorage.clear();
    logOut();
    history.replace({
      pathname: '/login',
    });
  }

  render() {
    const { history, user } = this.props;
    const { leftNavOpen, userDropdown } = this.state;
    return (
      <div className={`nav-fixed${!leftNavOpen ? ' sidenav-toggled' : ''}`}>
        <Header
          onToggle={this.handleToggle}
          user={user}
          userDropdown={userDropdown}
          logoutAction={this.handleLogOut}
          userDropdownToggle={this.handleUserToggle}
        />
        <div id="layoutSidenav">
          <LeftNav history={history} menu={verticalMenu} user={user} />
          <div id="layoutSidenav_content" onClick={this.closeUserToggle}>
            <main>{this.props.children}</main>
          </div>
        </div>
      </div>
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
      logOut,
    },
    dispatch
  );

Layout.propTypes = {
  children: PropTypes.any,
  history: PropTypes.any,
  user: PropTypes.object,
};

export default connect(mapStateToProps, mapDispatchToProps)(Layout);
