import PropTypes from 'prop-types';
import React from 'react';

import Timer from '@components/Timer';
import Lane1Active from '@images/409.MA.3 Lane1 car_2020_RG.png';
import Lane2Active from '@images/409.MA.4 Lane2 car_2020_RG.png';
import Lane3Active from '@images/409.MA.5 Lane3 car_2020_RG.png';
import Lane1Inactive from '@images/409.MA.6 Lane1 withoutcar_2020_RG.png';
import Lane2Inactive from '@images/409.MA.7 Lane2 withoutcar_2020_RG.png';
import Lane3Inactive from '@images/409.MA.8 Lane3 withoutcar_2020_RG.png';

import './index.scss';

const Lane = (props) => {
  const { active, laneNumber, isRacing } = props;

  const getLaneImage = (isActive, number) => {
    if (!isActive) {
      switch (number) {
        case 1:
          return Lane1Inactive;
        case 2:
          return Lane2Inactive;
        case 3:
          return Lane3Inactive;
        default:
          return Lane1Inactive;
      }
    }

    switch (number) {
      case 1:
        return Lane1Active;
      case 2:
        return Lane2Active;
      case 3:
        return Lane3Active;
      default:
        return Lane1Active;
    }
  };

  return (
    <div className="lane-container">
      <Timer active={active} isRacing={isRacing} />
      <img alt={`Lane ${laneNumber}`} src={getLaneImage(!active, laneNumber)} />
    </div>
  );
};

Lane.propTypes = {
  active: PropTypes.bool.isRequired,
  isRacing: PropTypes.bool.isRequired,
  laneNumber: PropTypes.number.isRequired,
};

export default Lane;
