import React from 'react';
import PropTypes from 'prop-types';
import { Form, Field } from 'formik';

const FormWrapper = ({ fields, action }) => {
  return (
    <Form>
      {fields.map((field, index) => (
        <Field key={index} {...field} />
      ))}
      <div className="form-group d-flex align-items-center justify-content-between mt-4 mb-0">
        <button className="btn btn-primary btn-block" type="submit">
          {!action ? 'Submit' : action}
        </button>
      </div>
    </Form>
  );
};

FormWrapper.propTypes = {
  fields: PropTypes.array.isRequired,
  action: PropTypes.string,
};

export default FormWrapper;
