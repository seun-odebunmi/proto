import React from 'react';

const PageSizeControl = ({ pageSize, setPageSize }) => {
  return (
    <div className="dataTables_length">
      <label>
        Show{' '}
        <select
          value={pageSize}
          className="custom-select custom-select-sm form-control form-control-sm"
          onChange={(e) => {
            setPageSize(Number(e.target.value));
          }}
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              {pageSize}
            </option>
          ))}
        </select>{' '}
        Entries
      </label>
    </div>
  );
};

export default PageSizeControl;
