import PropTypes from 'prop-types';
import React from 'react';

import Bubble from '@images/409 SplashScreen mediaIcon.png';

import './index.scss';

const AttractScreen = (props) => {
  const { callback } = props;

  return (
    <button
      className="attract-btn"
      onClick={() => callback()}
      type="button"
    >
      <div className="bubble-container x">
        <img
          alt="Start Button"
          className="y"
          src={Bubble}
        />
      </div>
    </button>
  );
};

AttractScreen.propTypes = {
  callback: PropTypes.func.isRequired,
};

export default AttractScreen;
