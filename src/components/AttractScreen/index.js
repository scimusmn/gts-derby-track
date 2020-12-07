import PropTypes from 'prop-types';
import React from 'react';

import SMM from '../../images/smm.png';

import './index.scss';

const AttractScreen = (props) => {
  const { callback } = props;

  return (
    <button
      className="attract-btn"
      onClick={() => callback()}
      type="button"
    >
      <div className="x" id="attractContainer">
        <img
          alt="Start Button"
          className="y"
          src={SMM}
        />
      </div>
    </button>
  );
};

AttractScreen.propTypes = {
  callback: PropTypes.func.isRequired,
};

export default AttractScreen;
