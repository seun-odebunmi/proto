import React from 'react'
import PropTypes from 'prop-types'
import { Button, Grid } from 'semantic-ui-react'
import { Form, Field } from 'formik'

const FormWrapper = ({ fields, action, grid = true }) => {
  return (
    <Form className="ui form">
      {grid ? (
        <Grid stackable columns={3} padded="vertically">
          <Grid.Row>
            {fields.map((field, index) => (
              <Grid.Column key={index}>
                <Field {...field} />
              </Grid.Column>
            ))}
          </Grid.Row>
        </Grid>
      ) : (
        fields.map((field, index) => <Field key={index} {...field} />)
      )}
      <div className="flex flex-column flex-row-ns items-center mt3">
        <Button type="submit">{!action ? 'Submit' : action}</Button>
      </div>
    </Form>
  )
}

FormWrapper.propTypes = {
  fields: PropTypes.array.isRequired,
  grid: PropTypes.bool,
  action: PropTypes.string
}

export default FormWrapper
