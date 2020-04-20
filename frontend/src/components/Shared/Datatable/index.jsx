import React from 'react';
import { useTable, useSortBy, usePagination } from 'react-table';

import PageSizeControl from './pageSizeControl';
import Table from './table';
import PagingInfo from './pagingInfo';
import Pagination from './pagination';

const Datatable = ({ columns, data, pageInitialState, fetchData, pageCount: ctrldPageCount }) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize, sortBy },
  } = useTable(
    {
      columns,
      data,
      initialState: pageInitialState,
      manualSortBy: true,
      manualPagination: true,
      pageCount: ctrldPageCount,
    },
    useSortBy,
    usePagination
  );

  React.useEffect(() => {
    fetchData({ pageIndex, pageSize, sortBy });
  }, [fetchData, pageIndex, pageSize, sortBy]);

  return (
    <div className="datatable table-responsive">
      <div className="dataTables_wrapper dt-bootstrap4">
        <div className="row">
          <div className="col-sm-12 col-md-6">
            <PageSizeControl pageSize={pageSize} setPageSize={setPageSize} />
          </div>
        </div>
        <div className="row">
          <div className="col-sm-12">
            <Table
              getTableProps={getTableProps}
              headerGroups={headerGroups}
              getTableBodyProps={getTableBodyProps}
              prepareRow={prepareRow}
              page={page}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-sm-12 col-md-5">
            <PagingInfo pageIndex={pageIndex} pageOptions={pageOptions} />
          </div>
          <div className="col-sm-12 col-md-7">
            <Pagination
              gotoPage={gotoPage}
              previousPage={previousPage}
              nextPage={nextPage}
              canPreviousPage={canPreviousPage}
              canNextPage={canNextPage}
              pageCount={pageCount}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Datatable;
