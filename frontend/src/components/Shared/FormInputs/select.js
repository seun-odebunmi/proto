import React from 'react'
import PropTypes from 'prop-types'
import { Form } from 'semantic-ui-react'

const FormSelect = ({ field, form, label, options, ...rest }) => {
  return (
    <Form.Group widths="equal">
      <Form.Field error={form.errors[field.name] ? true : false}>
        <label className={`${rest.required && 'required'}`}>{label}</label>
        <select
          className="form-control"
          {...field}
          {...rest}
          id={field.name}
        >
          <option value="">--Select--</option>
          {options &&
            options.map((option, index) => (
              <option key={index} value={option.id}>
                {option.name}
              </option>
            ))}
        </select>
        {form.errors[field.name] && (
          <small className="red mt1">{form.errors[field.name]}</small>
        )}
      </Form.Field>
    </Form.Group>
  )
}

FormSelect.propTypes = {
  field: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired,
  label: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired
}

export default FormSelect
