import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
import ReactHowler from 'react-howler';
import StoplightWait from '../../audio/stoplight-wait.wav';

const Audio = (props) => {
  const { trigger } = props;

  const Howler = useRef();
  const [isPlaying, setIsPlaying] = useState(false);

  const stop = () => {
    if (Howler.current !== null) {
      Howler.current.stop();
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    stop();

    if (trigger > 0 && trigger <= 3) setIsPlaying(true);
  }, [trigger]);

  return (
    <ReactHowler
      loop={false}
      playing={isPlaying}
      preload
      ref={Howler}
      src={StoplightWait}
    />
  );
};

Audio.propTypes = {
  trigger: PropTypes.number.isRequired,
};

export default Audio;
