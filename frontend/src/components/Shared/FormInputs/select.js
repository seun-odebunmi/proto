import React from 'react';
import PropTypes from 'prop-types';

const FormSelect = ({ field, form, label, options, ...rest }) => {
  return (
    <div className="form-group">
      <label htmlFor={field.name} className={`small mb-1 ${rest.required && 'required'}`}>
        {label}
      </label>
      <select className="form-control py-2" {...field} {...rest} id={field.name}>
        <option value="">
          --Select--
        </option>
        {options &&
          options.map((option, index) => (
            <option key={index} value={option.id}>
              {option.name}
            </option>
          ))}
      </select>
      {form.errors[field.name] && <small className="red mt1">{form.errors[field.name]}</small>}
    </div>
  );
};

FormSelect.propTypes = {
  field: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired,
  label: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
};

export default FormSelect;
