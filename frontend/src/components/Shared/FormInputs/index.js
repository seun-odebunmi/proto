import React from 'react'
import PropTypes from 'prop-types'
import { Form } from 'semantic-ui-react'

const FormInputs = ({ field, form, label, ...rest }) => {
  return (
    <Form.Group widths="equal">
      {rest.type === 'checkbox' ? (
        <Form.Field>
          <label htmlFor={field.name}>{label}</label>
          <Form.Checkbox
            {...field}
            {...rest}
            id={field.name}
            checked={form.values[field.name]}
          />
        </Form.Field>
      ) : (
        <Form.Input
          fluid
          label={label}
          placeholder={label}
          value={field.value === null ? '' : field.value}
          {...field}
          {...rest}
          id={field.name}
          error={form.errors[field.name] ? true : false}
        />
      )}
      {form.errors[field.name] && (
        <small className="red ph2 mt1">{form.errors[field.name]}</small>
      )}
    </Form.Group>
  )
}

FormInputs.propTypes = {
  field: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired,
  label: PropTypes.string.isRequired
}

export default FormInputs
