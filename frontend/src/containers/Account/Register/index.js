import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import RegisterComponent from '../../../components/Account/Register';
import { registerApi } from '../../../api';

class Register extends Component {
  componentDidMount() {
    const token = localStorage.getItem('token');
    if (token) {
      this.props.history.replace('/');
    }
  }

  formSubmit(values, { setSubmitting }) {
    const { history } = this.props;

    registerApi(values).then((res) => {
      if (res) {
        history.replace({
          pathname: '/login',
        });
      }
    });

    setSubmitting(false);
  }

  render() {
    return <RegisterComponent {...this.props} formSubmit={this.formSubmit.bind(this)} />;
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({}, dispatch);
};

Register.propTypes = {
  history: PropTypes.any.isRequired,
};

export default connect(null, mapDispatchToProps)(Register);
