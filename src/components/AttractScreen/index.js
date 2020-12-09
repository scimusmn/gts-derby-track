import PropTypes from 'prop-types';
import React from 'react';

import Bubble from '@images/409.MA.1 SplashScreenBubble_2020_RG.png';

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
