import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { Col, Container, Row } from 'reactstrap';

import { WAKE_ARDUINO } from '@arduino/arduino-base/ReactSerial/ArduinoConstants';
import IPC from '@arduino/arduino-base/ReactSerial/IPCMessages';
import withSerialCommunication from '@arduino/arduino-base/ReactSerial/SerialHOC';
import AttractScreen from '@components/AttractScreen';
import Audio from '@components/Audio';
import Lane from '@components/Lane';
import Stoplight from '@components/Stoplight';

import './index.scss';

const MESSAGE_GET_BEAMS = '{get-beam-states:1}';
const MESSAGE_START_RACE = "{ 'message': 'racing', 'value': 1 }";

function RenderStoplight(status) {
  return (<Stoplight status={status} />);
}

const App = (props) => {
  const {
    sendData, setOnDataCallback, startIpcCommunication, stopIpcCommunication,
  } = props;

  const [countdown, setCountdown] = useState(0);
  const [countdownInterval, setCountdownInterval] = useState(null);
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
  const [track1Start, setTrack1Start] = useState(false);
  const [track2Start, setTrack2Start] = useState(false);
  const [track3Start, setTrack3Start] = useState(false);
  // const [track1Time, setTrack1Time] = useState(0);
  // const [track2Time, setTrack2Time] = useState(0);
  // const [track3Time, setTrack3Time] = useState(0);

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
    clearInterval(racingInterval);
    setIsRacing(false);
  };

  const getRaceTime = (startTime) => {
    const msElapsed = Date.now() - startTime;
    const seconds = Math.floor(msElapsed / 1000);
    setTimeElapsed(`${Math.floor(msElapsed / 1000)}.${msElapsed - (seconds * 1000)}`);
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

      // if (serialData.message === 'time-track-1') setTrack1Time(serialData.value);
      // if (serialData.message === 'time-track-2') setTrack2Time(serialData.value);
      // if (serialData.message === 'time-track-3') setTrack3Time(serialData.value);
    }
  }, [serialData]);

  useEffect(() => {
    if (isRacing) {
      const startTime = Date.now();
      setRacingInterval(setInterval(() => getRaceTime(startTime), 10));
    }
  }, [isRacing]);

  useEffect(() => {
    if (timeElapsed >= 9.999) cleanupRacingInterval();
  }, [timeElapsed]);

  useEffect(() => {
    if (countdown > 2) cleanupCountdown();
    setStoplightComponent(RenderStoplight(countdown));
  }, [countdown]);

  useEffect(() => {
    if (!isAppIdle) sendMessage(MESSAGE_GET_BEAMS);
  }, [isAppIdle]);

  if (!handshake) return <p>no handshake</p>;
  if (isAppIdle) return <AttractScreen callback={() => setIsAppIdle(false)} />;

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
      </Helmet>
      <Audio trigger={(countdown)} />
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
                  isRacing={isRacing}
                  laneNumber={1}
                  time={timeElapsed}
                />
              </Col>
              <Col>
                <Lane
                  active={track2Start}
                  isRacing={isRacing}
                  laneNumber={2}
                  time={timeElapsed}
                />
              </Col>
              <Col>
                <Lane
                  active={track3Start}
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
