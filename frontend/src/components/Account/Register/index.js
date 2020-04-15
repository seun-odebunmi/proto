import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Formik } from 'formik';

import FormWrapper from '../../Shared/FormWrapper';
import fieldValidation from '../../../helpers/FieldValidation';

import { formFields } from './fieldSchema';

const Register = ({ formSubmit }) => {
  return (
    <Fragment>
      <div className="bg-primary-color w-40 center flex flex-column pa5 ph6 br2 mt6">
        <Formik
          initialValues={{}}
          validationSchema={fieldValidation(formFields)}
          onSubmit={formSubmit}
          component={() => <FormWrapper fields={formFields} action="Register" grid={false} />}
        />
        <Link to={'/login'} className="mt3">
          Login to Account
        </Link>
      </div>
    </Fragment>
  );
};

Register.propTypes = {
  formSubmit: PropTypes.func.isRequired,
};

export default Register;