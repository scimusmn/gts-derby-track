import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { Col, Container, Row } from 'reactstrap';
import { Wave } from 'react-animated-text';
import useSound from 'use-sound';

import { WAKE_ARDUINO } from '@arduino/arduino-base/ReactSerial/ArduinoConstants';
import IPC from '@arduino/arduino-base/ReactSerial/IPCMessages';
import withSerialCommunication from '@arduino/arduino-base/ReactSerial/SerialHOC';
import Song from '@audio/song.wav';
import StoplightGo from '@audio/stoplight-go.wav';
import StoplightWait from '@audio/stoplight-wait.wav';
import AttractScreen from '@components/AttractScreen';
import Lane from '@components/Lane';
import MessageBlock from '@components/MessageBlock';
import PreviousTimerDisplay from '@components/PreviousTimerDisplay';
import Stoplight from '@components/Stoplight';
import useInterval from '@hooks/useInterval';

import './index.scss';

const MESSAGE_GET_BEAMS = '{get-beam-states:1}';
const MESSAGE_RESET_SOLENOIDS = '{retract-solenoids:0}';
const MESSAGE_RETRACT_SOLENOIDS = '{retract-solenoids:1}';

function RenderStoplight(status) {
  return (<Stoplight status={status} />);
}

const App = (props) => {
  const {
    sendData, setOnDataCallback, startIpcCommunication, stopIpcCommunication,
  } = props;

  const [appTimeout, setAppTimeout] = useState(null);
  const [countdown, setCountdown] = useState(0);
  const [countdownInterval, setCountdownInterval] = useState(null);
  const [handshake, setHandshake] = useState(false);
  const [isAppIdle, setIsAppIdle] = useState(true);
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [isRacing, setIsRacing] = useState(false);
  const [messageTimeout, setMessageTimeout] = useState(null);
  const [messageVisibility, setMessageVisibility] = useState(false);
  const [pingArduinoStatus, setPingArduinoStatus] = useState(false);
  const [racingInterval, setRacingInterval] = useState(null);
  const [refreshPortCount, setRefreshPortCount] = useState(0);
  const [serialData, setSerialData] = useState({ message: '', value: '' });
  const [stoplightComponent, setStoplightComponent] = useState(null);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [track1Finish, setTrack1Finish] = useState(0);
  const [track2Finish, setTrack2Finish] = useState(0);
  const [track3Finish, setTrack3Finish] = useState(0);
  const [track1Placement, setTrack1Placement] = useState(0);
  const [track2Placement, setTrack2Placement] = useState(0);
  const [track3Placement, setTrack3Placement] = useState(0);
  const [track1PreviousFinish, setTrack1PreviousFinish] = useState(0);
  const [track2PreviousFinish, setTrack2PreviousFinish] = useState(0);
  const [track3PreviousFinish, setTrack3PreviousFinish] = useState(0);
  const [track1Start, setTrack1Start] = useState(false);
  const [track2Start, setTrack2Start] = useState(false);
  const [track3Start, setTrack3Start] = useState(false);

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
  };

  /** ***************** App functions ******************* */

  const appTimeoutReset = () => {
    clearTimeout(appTimeout);
    // Set 5 minute timeout for app
    setAppTimeout(setTimeout(() => setIsAppIdle(true), 300000));
  };

  const stopLightReset = () => {
    clearInterval(countdownInterval);
    setCountdownInterval(null);
    setCountdown(0);
    setIsCountingDown(false);
  };

  const cleanupCountdown = () => {
    stopLightReset();
    setIsRacing(true);
    sendMessage(MESSAGE_RETRACT_SOLENOIDS);
  };

  const cleanupMessageTimeout = () => {
    setMessageVisibility(false);
    clearTimeout(messageTimeout);
  };

  const cleanupRacingInterval = () => {
    sendMessage(MESSAGE_RESET_SOLENOIDS);
    clearInterval(racingInterval);
    setIsRacing(false);
    setTimeElapsed(0);
    appTimeoutReset();

    setTrack1Finish(0);
    setTrack2Finish(0);
    setTrack3Finish(0);

    song.stop();

    const results = [
      ['track1', track1Finish],
      ['track2', track2Finish],
      ['track3', track3Finish],
    ];

    const raceTimes = results.filter((result) => result[1] > 0);

    raceTimes.sort((a, b) => {
      if (a[1] === b[1]) return 0;
      return (a[1] < b[1]) ? -1 : 1;
    });

    for (let i = 0; i < raceTimes.length; i += 1) {
      switch (raceTimes[i][0]) {
        case 'track1':
          if (raceTimes[i][1] > 0) setTrack1Placement(i + 1);
          break;
        case 'track2':
          if (raceTimes[i][1] > 0) setTrack2Placement(i + 1);
          break;
        case 'track3':
          if (raceTimes[i][1] > 0) setTrack3Placement(i + 1);
          break;
        default:
          break;
      }
    }

    setTrack1PreviousFinish(track1Finish);
    setTrack2PreviousFinish(track2Finish);
    setTrack3PreviousFinish(track3Finish);
  };

  const resetTrackTimes = (trackNumber) => {
    switch (trackNumber) {
      case 1:
        setTrack1Finish(0);
        setTrack1Placement(0);
        break;
      case 2:
        setTrack2Finish(0);
        setTrack2Placement(0);
        break;
      case 3:
        setTrack3Finish(0);
        setTrack3Placement(0);
        break;
      default:
        setTrack1Finish(0);
        setTrack2Finish(0);
        setTrack3Finish(0);
        setTrack1Placement(0);
        setTrack2Placement(0);
        setTrack3Placement(0);
        break;
    }
  };

  /** ***************** useInterval hooks ***************** */
  useInterval(() => pingArduino(), 5000);

  /** ***************** useEffect hooks ******************* */

  useEffect(() => {
    setOnDataCallback((data) => onSerialData(data, setSerialData));
  }, []);

  useEffect(() => {
    if (serialData.message === 'arduino-ready' && serialData.value) {
      if (!handshake) setHandshake(true);

      setPingArduinoStatus(false);
      setRefreshPortCount(0);
    } else if (handshake) {
      appTimeoutReset();

      if (isAppIdle) {
        setIsAppIdle(false);
        resetTrackTimes();
      } else if (serialData.message === 'start-button-pressed' && !isAppIdle
        && !isRacing && countdown === 0 && !isCountingDown) {
        if (track1Start || track2Start || track3Start) {
          sendMessage(MESSAGE_GET_BEAMS);
          resetTrackTimes();

          setIsCountingDown(true);
          setCountdown(1);
          setCountdownInterval(setInterval(() => {
            setCountdown((prevState) => prevState + 1);
          }, 1000));
        } else {
          setMessageVisibility(true);
          setMessageTimeout(setTimeout(() => {
            setMessageVisibility(false);
          }, 5000));
        }
      }

      if (serialData.message === 'track-1-start' && !isRacing) {
        setTrack1Start(serialData.value === '1');
        // Set the message visibility to false because we have at least 1 car on the tracks
        cleanupMessageTimeout();
        resetTrackTimes(1);
      } else if (serialData.message === 'track-2-start' && !isRacing) {
        setTrack2Start(serialData.value === '1');
        // Set the message visibility to false because we have at least 1 car on the tracks
        cleanupMessageTimeout();
        resetTrackTimes(2);
      } else if (serialData.message === 'track-3-start' && !isRacing) {
        setTrack3Start(serialData.value === '1');
        // Set the message visibility to false because we have at least 1 car on the tracks
        cleanupMessageTimeout();
        resetTrackTimes(3);
      } else if (serialData.message === 'track-1-finish' && track1Finish === 0 && track1Start) {
        setTrack1Finish(timeElapsed);
      } else if (serialData.message === 'track-2-finish' && track2Finish === 0 && track2Start) {
        setTrack2Finish(timeElapsed);
      } else if (serialData.message === 'track-3-finish' && track3Finish === 0 && track3Start) {
        setTrack3Finish(timeElapsed);
      }
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
    const track1Finished = (track1Start) ? track1Finish > 0 : true;
    const track2Finished = (track2Start) ? track2Finish > 0 : true;
    const track3Finished = (track3Start) ? track3Finish > 0 : true;

    if (timeElapsed >= 10000 || (track1Finished && track2Finished && track3Finished)) {
      cleanupRacingInterval();
    }
  }, [timeElapsed, track1Finish, track2Finish, track3Finish]);

  useEffect(() => {
    if (track1Start || track2Start || track3Start) {
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
    } else {
      stopLightReset();
      setStoplightComponent(RenderStoplight(0));
    }
  }, [countdown]);

  useEffect(() => {
    if (!isAppIdle) sendMessage(MESSAGE_GET_BEAMS);
  }, [isAppIdle]);

  if (!handshake) {
    return (
      <div className="loading">
        <Wave effect="fadeOut" text="Loading..." />
      </div>
    );
  }

  if (isAppIdle) return <AttractScreen callback={() => setIsAppIdle(false)} />;

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
        />
      </Helmet>
      <Container className="app" fluid>
        <Row className="no-gutters">
          <div className="previous-race-column">
            <Row className="no-gutters">
              <Col>
                <PreviousTimerDisplay finishTime={track1PreviousFinish} />
              </Col>
            </Row>
            <Row className="no-gutters">
              <Col>
                <PreviousTimerDisplay finishTime={track2PreviousFinish} />
              </Col>
            </Row>
            <Row className="no-gutters">
              <Col>
                <PreviousTimerDisplay finishTime={track3PreviousFinish} />
              </Col>
            </Row>
          </div>
          <div className="track-lane-column">
            <Row className="no-gutters">
              <Col>
                <Lane
                  finish={track1Finish}
                  isActive={track1Start}
                  isRacing={isRacing}
                  laneNumber={1}
                  placement={track1Placement}
                  time={timeElapsed}
                />
              </Col>
              <Col>
                <Lane
                  finish={track2Finish}
                  isActive={track2Start}
                  isRacing={isRacing}
                  laneNumber={2}
                  placement={track2Placement}
                  time={timeElapsed}
                />
              </Col>
              <Col>
                <Lane
                  finish={track3Finish}
                  isActive={track3Start}
                  isRacing={isRacing}
                  laneNumber={3}
                  placement={track3Placement}
                  time={timeElapsed}
                />
              </Col>
            </Row>
          </div>
          <div className="stoplight-column">
            {stoplightComponent}
          </div>
        </Row>
        <MessageBlock
          isVisible={messageVisibility}
          message="At least one car is required to race. Please place a car on the track and try again."
        />
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
