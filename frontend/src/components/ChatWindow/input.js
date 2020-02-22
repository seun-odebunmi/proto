import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Typeahead } from 'react-bootstrap-typeahead';

const Input = ({ handleOnChange, handleSubmit, typing, typeaheadOptions }) => {
  return (
    <form className="Message flex flex-column items-center" onSubmit={handleSubmit}>
      {typeaheadOptions.length === 0 ? (
        <input
          className="Message__input"
          placeholder="Write a message"
          onChange={e => handleOnChange(e.target.value)}
          value={typing}
        />
      ) : (
        <Fragment>
          <Typeahead
            labelKey="value"
            id="messageSelect"
            options={typeaheadOptions}
            onChange={handleOnChange}
            dropup={true}
            placeholder="Select an option"
          />
          <button
            type="submit"
            style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px' }}
            tabIndex="-1"
          ></button>
        </Fragment>
      )}
    </form>
  );
};

Input.propTypes = {
  typing: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  typeaheadOptions: PropTypes.array,
  handleOnChange: PropTypes.func,
  handleSubmit: PropTypes.func
};

export default Input;
