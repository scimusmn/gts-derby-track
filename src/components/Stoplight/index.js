import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';

import StoplightOff from '@images/409.MA.9 Lights off_2020_RG.png';
import StoplightRed from '@images/409.MA.10 Lights red_2020_RG.png';
import StoplightGreen from '@images/409.MA.11 Lights green_2020_RG3.png';

import './index.scss';

function RenderLights(status) {
  switch (status) {
    case 0:
      return StoplightOff;
    case 1:
      return StoplightRed;
    case 2:
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
