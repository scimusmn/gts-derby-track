import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';

import StoplightOff from '@images/409 Light_1.png';
import StoplightGreen from '@images/409 Light_4.png';
import StoplightRed from '@images/409 Light_2.png';
import StoplightYellow from '@images/409 Light_3.png';

import './index.scss';

function RenderLights(status) {
  switch (status) {
    case 0:
      return StoplightOff;
    case 1:
      return StoplightRed;
    case 2:
      return StoplightYellow;
    case 3:
      return StoplightGreen;
    default:
      return StoplightOff;
  }
}

const Stoplight = (props) => {
  const { status } = props;
  const [stoplightImage, setStoplightImage] = useState();

  useEffect(() => {
    setStoplightImage(RenderLights(status));
  }, [status]);

  return (
    <div className="stoplight">
      <img alt="stoplight" src={stoplightImage} />
    </div>
  );
};

Stoplight.propTypes = {
  status: PropTypes.number.isRequired,
};

export default Stoplight;
