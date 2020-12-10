import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';

import './index.scss';

const Timer = (props) => {
  const { isRacing } = props;

  const [timeElapsed, setTimeElapsed] = useState(8.888);

  const getRaceTime = (startTime) => {
    const msElapsed = Date.now() - startTime;
    const seconds = Math.floor(msElapsed / 1000);
    setTimeElapsed(`${Math.floor(msElapsed / 1000)}.${msElapsed - (seconds * 1000)}`);
  };

  useEffect(() => {
    const startTime = Date.now();
    if (isRacing) setInterval(() => getRaceTime(startTime), 10);
  }, [isRacing]);

  return (
    <div className="timer">
      <span className={(isRacing) ? '' : 'd-none'}>
        {timeElapsed}
      </span>
    </div>
  );
};

Timer.propTypes = {
  isRacing: PropTypes.bool.isRequired,
};

export default Timer;
