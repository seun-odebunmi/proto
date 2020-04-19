import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Formik } from 'formik';

import FormWrapper from '../../Shared/FormWrapper';
import fieldValidation from '../../../helpers/FieldValidation';

import { formFields } from './fieldSchema';

const Register = ({ formSubmit }) => {
  return (
    <div id="layoutAuthentication">
      <div id="layoutAuthentication_content">
        <main>
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-5">
                <div className="card shadow-lg border-0 rounded-lg mt-5">
                  <div className="card-header justify-content-center">
                    <h3 className="font-weight-light my-4">Register</h3>
                  </div>
                  <div className="card-body">
                    <Formik
                      initialValues={{}}
                      validationSchema={fieldValidation(formFields)}
                      onSubmit={formSubmit}
                      component={() => (
                        <FormWrapper fields={formFields} action="Register" grid={false} />
                      )}
                    />
                  </div>
                  <div className="card-footer text-center">
                    <div className="small">
                      <Link to={'/login'} className="mt3">
                        Have an account? Go to login
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

Register.propTypes = {
  formSubmit: PropTypes.func.isRequired,
};

export default Register;
