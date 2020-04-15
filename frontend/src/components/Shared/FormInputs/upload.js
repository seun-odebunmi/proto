import React from 'react'
import PropTypes from 'prop-types'
import { Form } from 'semantic-ui-react'
import Dropzone from 'react-dropzone'

const onDrop = acceptedFiles => {
  acceptedFiles.forEach(file => {
    const reader = new FileReader()

    reader.onload = () => {
      const dataUrl = reader.result
      console.log(dataUrl)
    }

    reader.readAsDataURL(file)
  })
}

const FormUploadInput = ({ field, form, label, ...rest }) => (
  <Form.Field>
    {label && <label htmlFor={field.name}>{label}</label>}
    <Dropzone
      accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel text/csv"
      onDrop={onDrop}
      {...rest}
      className="br0 w-100 h4 ba b--light-gray"
      activeClassName="bg-light-green"
      rejectClassName="bg-light-red"
    >
      {({ acceptedFiles, rejectedFiles }) => {
        return acceptedFiles.length || rejectedFiles.length
          ? `${acceptedFiles[0].name}`
          : 'Drag and drop your customer file here (supports excel and csv)'
      }}
    </Dropzone>
    {form.errors[field.name] && form.touched[field.name] && (
      <small className="f6 dark-red db mb2">{form.errors[field.name]}</small>
    )}
  </Form.Field>
)

FormUploadInput.propTypes = {
  field: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired,
  label: PropTypes.string.isRequired
}

export default FormUploadInput
