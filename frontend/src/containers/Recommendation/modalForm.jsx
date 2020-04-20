import React from 'react';
import { MDBBtn, MDBModal, MDBModalBody, MDBModalHeader, MDBModalFooter } from 'mdbreact';
import { Formik, Form, Field } from 'formik';

import { formFormFields } from './formFieldSchema';
import fieldValidation from '../../helpers/FieldValidation';

const ModalForm = ({ toggle, onSubmit, open, data, action }) => {
  const { id, Recommendation } = data;
  const { message, id: recId } = Recommendation || {};
  const initialValues = {
    medicalRecord_id: id,
    ...(message && { message }),
    ...(recId && { id: recId }),
  };

  return (
    <MDBModal isOpen={open} toggle={toggle} size="lg">
      <MDBModalHeader toggle={toggle}>{action}</MDBModalHeader>
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={fieldValidation(formFormFields)}
      >
        <Form>
          <MDBModalBody>
            {formFormFields.map((field, index) => (
              <Field key={index} {...field} />
            ))}
          </MDBModalBody>
          <MDBModalFooter>
            <MDBBtn color="secondary" onClick={toggle}>
              Close
            </MDBBtn>
            <MDBBtn type="submit" color="primary">
              Save changes
            </MDBBtn>
          </MDBModalFooter>
        </Form>
      </Formik>
    </MDBModal>
  );
};

export default ModalForm;
