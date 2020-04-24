import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Typeahead } from 'react-bootstrap-typeahead';

const Input = ({
  handleOnChange,
  handleSubmit,
  handleChartEnd,
  typing,
  typeaheadOptions,
  botTypingStatus,
  diagnosisStatus,
}) => {
  return (
    <div className="Message flex flex-column items-center">
      {(!diagnosisStatus && (
        <form onSubmit={handleSubmit}>
          {typeaheadOptions && typeaheadOptions.length > 0 ? (
            <Fragment>
              <Typeahead
                labelKey="value"
                id="messageSelect"
                options={typeaheadOptions || []}
                onChange={handleOnChange}
                disabled={botTypingStatus || diagnosisStatus}
                dropup={true}
                placeholder="Select an option"
              />
              <button
                type="submit"
                style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px' }}
                tabIndex="-1"
              ></button>
            </Fragment>
          ) : (
            <input
              className="Message__input"
              placeholder="Write a message"
              disabled={botTypingStatus || diagnosisStatus}
              onChange={(e) => handleOnChange(e.target.value)}
              value={typing}
            />
          )}
        </form>
      )) || (
        <button className="End__btn" onClick={handleChartEnd}>
          End conversation
        </button>
      )}
    </div>
  );
};

Input.propTypes = {
  typing: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  typeaheadOptions: PropTypes.array,
  botTypingStatus: PropTypes.bool,
  diagnosisStatus: PropTypes.bool,
  handleChartEnd: PropTypes.func,
  handleOnChange: PropTypes.func,
  handleSubmit: PropTypes.func,
};

export default Input;
