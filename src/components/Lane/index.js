import PropTypes from 'prop-types';
import React from 'react';

import Timer from '@components/Timer';

import './index.scss';

const Lane = (props) => {
  const { active, laneNumber, isRacing } = props;

  return (
    <div className={(active) ? 'lane active bg-primary' : 'lane bg-info'}>
      <h1 className="text-center">
        Lane
        {' '}
        {laneNumber}
      </h1>
      <Timer active={active} isRacing={isRacing} />
      <div className="track">
        <div className="car" />
      </div>
    </div>
  );
};

Lane.propTypes = {
  active: PropTypes.bool.isRequired,
  isRacing: PropTypes.bool.isRequired,
  laneNumber: PropTypes.number.isRequired,
};

export default Lane;
