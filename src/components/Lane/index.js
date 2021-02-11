import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';

import Lane1Active from '@images/409 Lanes_1.png';
import Lane2Active from '@images/409 Lanes_2.png';
import Lane3Active from '@images/409 Lanes_3.png';
import Lane1Inactive from '@images/409 Lanes_4.png';
import Lane2Inactive from '@images/409 Lanes_5.png';
import Lane3Inactive from '@images/409 Lanes_6.png';

import BlueRibbon from '@images/409 BlueRibbon.png';
import RedRibbon from '@images/409 RedRibbon.png';
import YellowRibbon from '@images/409 YellowRibbon.png';

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

function RenderRibbon(placement) {
  let ribbon;

  switch (placement) {
    case 1:
      ribbon = BlueRibbon;
      break;
    case 2:
      ribbon = RedRibbon;
      break;
    case 3:
      ribbon = YellowRibbon;
      break;
    default:
      break;
  }

  if (ribbon) {
    return <img alt="ribbon" className="ribbon" src={ribbon} />;
  }

  return null;
}

const Lane = (props) => {
  const {
    displayRibbons, finish, laneNumber, isActive,
    isRacing, placement, time,
  } = props;

  const [active, setActive] = useState(false);
  const [laneImage, setLaneImage] = useState(null);
  const [ribbon, setRibbon] = useState(null);
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
      ((((ms - (secondsTime * 1000)) - (firstTime * 100)) - (secondTime * 10))),
    );

    setSeconds(secondsTime);
    setFirst(firstTime);
    setSecond(secondTime);
    setThird(thirdTime);
  };

  useEffect(() => {
    // Prevent Lane from switching images if we're racing
    if (!isRacing) {
      setActive(isActive);
      setLaneImage(RenderLaneImage(isActive, laneNumber));
    }
  }, [isActive, isRacing, laneNumber]);

  useEffect(() => {
    if (finish !== 0) calculateDigits(finish);
    else calculateDigits(time);
  }, [finish, time]);

  useEffect(() => {
    setRibbon(RenderRibbon(placement));
  }, [placement]);

  return (
    <div className="lane-container">
      <div className={(active && (isRacing || displayRibbons)) ? 'timer' : 'd-none timer'}>
        <span className="seconds">{seconds}</span>
        <span className="decimal">.</span>
        <span className="first">{first}</span>
        <span className="second">{second}</span>
        <span className="third">{third}</span>
      </div>
      <img alt={`Lane ${laneNumber}`} src={laneImage} />
      {ribbon}
    </div>
  );
};

Lane.propTypes = {
  displayRibbons: PropTypes.bool.isRequired,
  finish: PropTypes.number.isRequired,
  isActive: PropTypes.bool.isRequired,
  isRacing: PropTypes.bool.isRequired,
  laneNumber: PropTypes.number.isRequired,
  placement: PropTypes.number.isRequired,
  time: PropTypes.number.isRequired,
};

export default Lane;
