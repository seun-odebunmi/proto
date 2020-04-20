import React from 'react';
import PropTypes from 'prop-types';

const FormInputs = ({ field, form, label, ...rest }) => {
  return (
    <div className="form-group">
      <label htmlFor={field.name} className={`small mb-1 ${rest.required && 'required'}`}>
        {label}
      </label>
      {rest.type === 'checkbox' && (
        <input
          type="checkbox"
          {...field}
          {...rest}
          id={field.name}
          checked={form.values[field.name]}
        />
      )}
      {rest.type === 'textarea' && (
        <textarea
          className="form-control py-2"
          value={field.value === null ? '' : field.value}
          {...field}
          {...rest}
          id={field.name}
        />
      )}
      {rest.type !== 'checkbox' && rest.type !== 'textarea' && (
        <input
          className="form-control py-2"
          type={rest.type}
          placeholder={label}
          value={field.value === null ? '' : field.value}
          {...field}
          {...rest}
          id={field.name}
        />
      )}
      {form.errors[field.name] && <small className="red ph2 mt1">{form.errors[field.name]}</small>}
    </div>
  );
};

FormInputs.propTypes = {
  field: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired,
  label: PropTypes.string.isRequired,
};

export default FormInputs;
