import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';

function RenderDisplay(time) {
  if (time > 0) {
    const secondsTime = Math.floor(time / 1000);
    const firstTime = Math.floor((time - (secondsTime * 1000)) / 100);
    const secondTime = Math.floor(
      (((time - (secondsTime * 1000)) - (firstTime * 100))) / 10,
    );
    const thirdTime = Math.floor(
      ((((time - (secondsTime * 1000)) - (firstTime * 100)) - (secondTime * 10))),
    );

    return (
      <div className="timer">
        <span className="seconds">{secondsTime}</span>
        <span className="decimal">.</span>
        <span className="first">{firstTime}</span>
        <span className="second">{secondTime}</span>
        <span className="third">{thirdTime}</span>
      </div>
    );
  }

  return (
    <div className="timer">
      <span className="seconds">-</span>
      <span className="decimal">.</span>
      <span className="first">-</span>
      <span className="second">-</span>
      <span className="third">-</span>
    </div>
  );
}

const PreviousTimerDisplay = (props) => {
  const { displayRibbons, finishTime } = props;

  const [timerDisplay, setTimerDisplay] = useState(null);

  useEffect(() => {
    if (!displayRibbons) setTimerDisplay(RenderDisplay(finishTime));
  }, [displayRibbons, finishTime]);

  return (
    <>{timerDisplay}</>
  );
};

PreviousTimerDisplay.propTypes = {
  displayRibbons: PropTypes.bool.isRequired,
  finishTime: PropTypes.number.isRequired,
};

export default PreviousTimerDisplay;
