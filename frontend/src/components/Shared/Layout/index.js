import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Header from './header';
import LeftNav from './leftNav';
import { verticalMenu } from './menu';

class Layout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      leftNavOpen: true,
      rightNavOpen: false,
    };
  }

  componentDidMount() {
    const token = localStorage.getItem('token');
    if (!token) {
      this.props.history.replace('/login');
    }
  }

  handleToggle() {
    this.setState({ leftNavOpen: !this.state.leftNavOpen });
  }

  handleRightNavToggle() {
    this.setState({ rightNavOpen: !this.state.rightNavOpen });
  }

  handleLinkNav(path) {
    this.props.history.replace({
      pathname: path,
    });
  }

  handleLogOut = (history) => {
    localStorage.clear();
    history.replace({
      pathname: '/login',
    });
  };

  render() {
    const { history, user } = this.props;
    return (
      <Fragment>
        <LeftNav
          visible={this.state.leftNavOpen}
          history={history}
          menu={verticalMenu}
          linkAction={(path) => this.handleLinkNav(path)}
        >
          <Header
            onToggle={() => this.handleToggle()}
            user={user.name}
            linkAction={(path) => this.handleLinkNav(path)}
            logoutAction={() => this.handleLogOut(history)}
          />
          <div className="content-start flex flex-column flex-wrap">{this.props.children}</div>
        </LeftNav>
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    ...state,
  };
};

Layout.propTypes = {
  children: PropTypes.any,
  history: PropTypes.any,
  user: PropTypes.object,
};

export default connect(mapStateToProps)(Layout);
