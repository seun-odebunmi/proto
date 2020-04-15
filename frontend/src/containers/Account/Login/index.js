import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import LoginComponent from '../../../components/Account/Login';
import { loginApi, setToken } from '../../../api';
import { loginUser } from '../../../actions';

class Login extends Component {
  componentDidMount() {
    const token = localStorage.getItem('token');
    if (token) {
      this.props.history.replace('/');
    }
  }

  formSubmit(values, { setSubmitting }) {
    const { history, loginUser } = this.props;

    loginApi(values).then((res) => {
      if (res) {
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res.user));
        setToken(res.token);
        loginUser(res.user);
        history.replace({
          pathname: '/',
        });
      }
    });

    setSubmitting(false);
  }

  render() {
    return <LoginComponent {...this.props} formSubmit={this.formSubmit.bind(this)} />;
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ loginUser }, dispatch);
};

Login.propTypes = {
  history: PropTypes.any.isRequired,
};

export default connect(null, mapDispatchToProps)(Login);
