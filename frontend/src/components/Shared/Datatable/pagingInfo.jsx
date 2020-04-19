import React from 'react';

const PagingInfo = ({ pageIndex, pageOptions }) => {
  return (
    <div className="dataTables_info">
      <span>
        Page{' '}
        <strong>
          {pageIndex + 1} of {pageOptions.length}
        </strong>{' '}
      </span>
    </div>
  );
};

export default PagingInfo;
