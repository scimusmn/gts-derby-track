import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';

import Lane1Active from '@images/409.MA.3 Lane1 withcar_2020_RG.png';
import Lane2Active from '@images/409.MA.4 Lane2 withcar_2020_RG.png';
import Lane3Active from '@images/409.MA.5  Lane3 withcar_2020_RG.png';
import Lane1Inactive from '@images/409.MA.6 Lane1 withoutcar_2020_RG4.png';
import Lane2Inactive from '@images/409.MA.7 Lane7 withoutcar_2020_RG5.png';
import Lane3Inactive from '@images/409.MA.8 Lane3 withoutcar_2020_RG.png';

import './index.scss';

function RenderLaneImage(isActive, number) {
  if (!isActive) {
    switch (number) {
      case 1:
        return Lane1Inactive;
      case 2:
        return Lane2Inactive;
      case 3:
        return Lane3Inactive;
      default:
        return null;
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
      return null;
  }
}

const Lane = (props) => {
  const {
    active, finish, laneNumber, isRacing, time,
  } = props;

  const [laneImage, setLaneImage] = useState(null);
  const [seconds, setSeconds] = useState(0);
  const [first, setFirst] = useState(0);
  const [second, setSecond] = useState(0);
  const [third, setThird] = useState(0);

  const calculateDigits = (ms) => {
    const secondsTime = Math.floor(ms / 1000);
    const firstTime = Math.floor((ms - (secondsTime * 1000)) / 100);

    const secondTime = Math.floor(
      (((ms - (secondsTime * 1000)) - (firstTime * 100))) / 10,
    );
    const thirdTime = Math.floor(
      (((((ms - (secondsTime * 1000)) - (firstTime * 100)) - (secondTime * 10)) / 10)),
    );

    setSeconds(secondsTime);
    setFirst(firstTime);
    setSecond(secondTime);
    setThird(thirdTime);
  };

  useEffect(() => {
    // Prevent Lane from switching images if we're racing
    if (!isRacing) setLaneImage(RenderLaneImage(active, laneNumber));
  }, [active, isRacing, laneNumber]);

  useEffect(() => {
    if (finish !== 0) calculateDigits(finish);
    else calculateDigits(time);
  }, [finish, time]);

  return (
    <div className="lane-container">
      <div className={(isRacing) ? 'timer' : 'd-none timer'}>
        <span className="seconds">{seconds}</span>
        <span className="decimal">.</span>
        <span className="first">{first}</span>
        <span className="second">{second}</span>
        <span className="third">{third}</span>
      </div>
      <img alt={`Lane ${laneNumber}`} src={laneImage} />
    </div>
  );
};

Lane.propTypes = {
  active: PropTypes.bool.isRequired,
  finish: PropTypes.number.isRequired,
  isRacing: PropTypes.bool.isRequired,
  laneNumber: PropTypes.number.isRequired,
  time: PropTypes.number.isRequired,
};

export default Lane;
