import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { Col, Container, Row } from 'reactstrap';
import { Wave } from 'react-animated-text';
import useSound from 'use-sound';

import { WAKE_ARDUINO } from '@arduino/arduino-base/ReactSerial/ArduinoConstants';
import IPC from '@arduino/arduino-base/ReactSerial/IPCMessages';
import withSerialCommunication from '@arduino/arduino-base/ReactSerial/SerialHOC';
import AttractScreen from '@components/AttractScreen';
import Lane from '@components/Lane';
import Stoplight from '@components/Stoplight';

import Song from '@audio/song.wav';
import StoplightGo from '@audio/stoplight-go.wav';
import StoplightWait from '@audio/stoplight-wait.wav';

import './index.scss';

const MESSAGE_GET_BEAMS = '{get-beam-states:1}';
const MESSAGE_START_RACE = '{racing:1}';

function RenderStoplight(status) {
  return (<Stoplight status={status} />);
}

const App = (props) => {
  const {
    sendData, setOnDataCallback, startIpcCommunication, stopIpcCommunication,
  } = props;

  const [countdown, setCountdown] = useState(0);
  const [countdownInterval, setCountdownInterval] = useState(null);
  const [dev] = useState(false);
  const [handshake, setHandshake] = useState(false);
  const [isAppIdle, setIsAppIdle] = useState(true);
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [isRacing, setIsRacing] = useState(false);
  const [pingArduinoStatus, setPingArduinoStatus] = useState(false);
  const [racingInterval, setRacingInterval] = useState(null);
  const [refreshPortCount, setRefreshPortCount] = useState(0);
  const [serialData, setSerialData] = useState({ message: '', value: '' });
  const [stoplightComponent, setStoplightComponent] = useState(null);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [track1Finish, setTrack1Finish] = useState(0);
  const [track2Finish, setTrack2Finish] = useState(0);
  const [track3Finish, setTrack3Finish] = useState(0);
  const [track1Start, setTrack1Start] = useState(false);
  const [track2Start, setTrack2Start] = useState(false);
  const [track3Start, setTrack3Start] = useState(false);
  // const [track1Time, setTrack1Time] = useState(0);
  // const [track2Time, setTrack2Time] = useState(0);
  // const [track3Time, setTrack3Time] = useState(0);

  const [playSong, song] = useSound(Song, { loop: true });
  const [playStoplightGo, stoplightGo] = useSound(StoplightGo);
  const [playStoplightWait, stoplightWait] = useSound(StoplightWait);

  const onSerialData = (data, setData) => {
    const message = Object.keys(data)[0];
    const value = Object.values(data)[0];

    setData({ message, value });
  };

  const sendMessage = (msg) => {
    console.log('sendMessage:', msg);

    // This is where we pass it through our HOC method to Stele, which passes to Serial device.
    sendData(msg);
  };

  const refreshPorts = () => {
    if (refreshPortCount === 3) {
      setHandshake(false);

      console.log('sending RESET-PORT');
      sendData(IPC.RESET_PORTS_COMMAND);
      console.log('restarting ipcCommunication...');

      stopIpcCommunication();
      startIpcCommunication();
    }

    setRefreshPortCount(refreshPortCount + 1);
  };

  const pingArduino = () => {
    if (pingArduinoStatus) refreshPorts();

    setPingArduinoStatus(true);
    sendData(JSON.stringify(WAKE_ARDUINO));

    setTimeout(() => pingArduino(), 5000);
  };

  /** ***************** App functions ******************* */

  const cleanupCountdown = () => {
    clearInterval(countdownInterval);
    setCountdownInterval(null);
    setCountdown(0);
    setIsCountingDown(false);
    setIsRacing(true);
    sendMessage(MESSAGE_START_RACE);
  };

  const cleanupRacingInterval = () => {
    console.log('cleanup race');
    clearInterval(racingInterval);
    setIsRacing(false);
    setTimeElapsed(0);
    song.stop();
  };

  /** ***************** useEffect hooks ******************* */

  useEffect(() => {
    setOnDataCallback((data) => onSerialData(data, setSerialData));
    pingArduino();
  }, []);

  useEffect(() => {
    if (serialData.message === 'arduino-ready' && serialData.value) {
      if (!handshake) setHandshake(true);

      setPingArduinoStatus(false);
      setRefreshPortCount(0);
    }

    if (handshake) {
      if (serialData.message === 'start-button-pressed' && !isAppIdle
        && !isRacing && countdown === 0 && !isCountingDown
      ) {
        setIsCountingDown(true);
        setCountdownInterval(setInterval(() => {
          setCountdown((prevState) => prevState + 1);
        }, 1000));
      }

      if (serialData.message === 'track-1-start') setTrack1Start(serialData.value === '1');
      if (serialData.message === 'track-2-start') setTrack2Start(serialData.value === '1');
      if (serialData.message === 'track-3-start') setTrack3Start(serialData.value === '1');

      if (serialData.message === 'track-1-finish') setTrack1Finish(timeElapsed);
      if (serialData.message === 'track-2-finish') setTrack2Finish(timeElapsed);
      if (serialData.message === 'track-3-finish') setTrack3Finish(timeElapsed);
    }
  }, [serialData]);

  useEffect(() => {
    if (isRacing) {
      song.stop();
      playSong();

      const startTime = Date.now();
      setRacingInterval(setInterval(() => {
        const msElapsed = Date.now() - startTime;
        setTimeElapsed(msElapsed);
      }, 50));
    }
  }, [isRacing]);

  useEffect(() => {
    if (timeElapsed >= 10000) cleanupRacingInterval();
  }, [timeElapsed]);

  useEffect(() => {
    if (countdown === 1) {
      stoplightWait.stop();
      playStoplightWait();
    }

    if (countdown === 2) {
      stoplightGo.stop();
      playStoplightGo();
    }

    if (countdown > 2) cleanupCountdown();
    setStoplightComponent(RenderStoplight(countdown));
  }, [countdown]);

  useEffect(() => {
    if (!isAppIdle) sendMessage(MESSAGE_GET_BEAMS);
  }, [isAppIdle]);

  if (!handshake && !dev) {
    return (
      <div className="loading">
        <Wave effect="fadeOut" text="Loading..." />
      </div>
    );
  }

  if (isAppIdle && !dev) return <AttractScreen callback={() => setIsAppIdle(false)} />;

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
      </Helmet>
      <Container className="app" fluid>
        <Row className="no-gutters">
          <div className="previous-race-column">
            HI
          </div>
          <div className="track-lane-column">
            <Row className="no-gutters">
              <Col>
                <Lane
                  active={track1Start}
                  finish={track1Finish}
                  isRacing={isRacing}
                  laneNumber={1}
                  time={timeElapsed}
                />
              </Col>
              <Col>
                <Lane
                  active={track2Start}
                  finish={track2Finish}
                  isRacing={isRacing}
                  laneNumber={2}
                  time={timeElapsed}
                />
              </Col>
              <Col>
                <Lane
                  active={track3Start}
                  finish={track3Finish}
                  isRacing={isRacing}
                  laneNumber={3}
                  time={timeElapsed}
                />
              </Col>
            </Row>
          </div>
          <div className="stoplight-column">
            {stoplightComponent}
          </div>
        </Row>
      </Container>
    </>
  );
};

App.propTypes = {
  sendData: PropTypes.func.isRequired,
  setOnDataCallback: PropTypes.func.isRequired,
  startIpcCommunication: PropTypes.func.isRequired,
  stopIpcCommunication: PropTypes.func.isRequired,
};

const AppWithSerialCommunication = withSerialCommunication(App);
export default AppWithSerialCommunication;
