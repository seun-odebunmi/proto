import React from 'react';
import FeatherIcon from 'feather-icons-react';

const Button = ({ onClick, rowData, icon, action }) => {
  return (
    <button
      className="btn btn-datatable btn-icon btn-transparent-light"
      title={action}
      onClick={() => onClick(rowData, action)}
    >
      <FeatherIcon icon={icon} />
    </button>
  );
};

export default Button;
