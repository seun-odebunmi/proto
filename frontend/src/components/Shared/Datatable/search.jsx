import React from 'react';

const Search = ({ column: { filterValue, setFilter, id } }) => {
  return (
    <input
      type="search"
      className="form-control form-control-sm"
      placeholder={`Search ${id}...`}
      value={filterValue || ''}
      onChange={(e) => {
        setFilter(e.target.value || undefined);
      }}
    ></input>
  );
};

export default Search;
