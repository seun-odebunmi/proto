import React from 'react';
import moment from 'moment';
import { MDBModal, MDBModalBody, MDBModalHeader } from 'mdbreact';

const Modal = ({ toggle, open, data, action }) => {
  const { date, message } = data;

  return (
    <MDBModal isOpen={open} toggle={toggle} size="lg">
      <MDBModalHeader toggle={toggle}>{action}</MDBModalHeader>
      <MDBModalBody>
        <div className="form-group">
          <label className="b">Date</label>
          <p>{moment.parseZone(new Date(date)).format('DD-MM-YYYY HH:mm:ss')}</p>
        </div>
        <div className="form-group">
          <label className="b">Message</label>
          <p>{message}</p>
        </div>
      </MDBModalBody>
    </MDBModal>
  );
};

export default Modal;
