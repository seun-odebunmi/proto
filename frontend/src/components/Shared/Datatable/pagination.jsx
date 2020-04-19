import React from 'react';

const Pagination = ({
  gotoPage,
  previousPage,
  nextPage,
  canPreviousPage,
  canNextPage,
  pageCount,
}) => {
  return (
    <div className="dataTables_paginate paging_simple_numbers">
      <ul className="pagination">
        <li className="paginate_button page-item">
          <button className="page-link" onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
            {'<<'}
          </button>
        </li>
        <li className="paginate_button page-item">
          <button className="page-link" onClick={() => previousPage()} disabled={!canPreviousPage}>
            {'<'}
          </button>
        </li>
        <li className="paginate_button page-item">
          <button className="page-link" onClick={() => nextPage()} disabled={!canNextPage}>
            {'>'}
          </button>
        </li>
        <li className="paginate_button page-item">
          <button
            className="page-link"
            onClick={() => gotoPage(pageCount - 1)}
            disabled={!canNextPage}
          >
            {'>>'}
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Pagination;
