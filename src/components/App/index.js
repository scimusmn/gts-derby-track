import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { Button, Container } from 'reactstrap';

import { WAKE_ARDUINO } from '@arduino/arduino-base/ReactSerial/ArduinoConstants';
import IPC from '@arduino/arduino-base/ReactSerial/IPCMessages';
import withSerialCommunication from '@arduino/arduino-base/ReactSerial/SerialHOC';
import AttractScreen from '@components/AttractScreen';

const RACE = "{ 'message': 'racing', 'value': 1 }";

const App = (props) => {
  const {
    sendData, setOnDataCallback, startIpcCommunication, stopIpcCommunication,
  } = props;

  const [active, setActive] = useState(false);
  const [handshake, setHandshake] = useState(false);
  const [pingArduinoStatus, setPingArduinoStatus] = useState(false);
  const [refreshPortCount, setRefreshPortCount] = useState(0);
  const [serialData, setSerialData] = useState({ message: '', value: '' });
  const [track1Start, setTrack1Start] = useState(false);
  const [track2Start, setTrack2Start] = useState(false);
  const [track3Start, setTrack3Start] = useState(false);
  const [track1Time, setTrack1Time] = useState(0);
  const [track2Time, setTrack2Time] = useState(0);
  const [track3Time, setTrack3Time] = useState(0);

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
      if (serialData.message === 'track_1_start') setTrack1Start(parseInt(serialData.value, 10));
      if (serialData.message === 'track_2_start') setTrack2Start(parseInt(serialData.value, 10));
      if (serialData.message === 'track_3_start') setTrack3Start(parseInt(serialData.value, 10));

      if (serialData.message === 'time_track_1') setTrack1Time(serialData.value);
      if (serialData.message === 'time_track_2') setTrack2Time(serialData.value);
      if (serialData.message === 'time_track_3') setTrack3Time(serialData.value);
    }
  }, [serialData]);

  if (!handshake) return <p>no handshake</p>;

  if (!active) return <AttractScreen callback={() => setActive(true)} />;

  return (
    <Container className="text-light">
      <Button
        className="d-none"
        color="primary"
        onClick={() => sendMessage(RACE)}
      >
        Race!
      </Button>
      <p className={(track1Start) ? 'bg-primary' : 'bg-info'}>
        Track 1:
        {' '}
        {track1Time}
      </p>
      <p className={(track2Start) ? 'bg-primary' : 'bg-info'}>
        Track 2:
        {' '}
        {track2Time}
      </p>
      <p className={(track3Start) ? 'bg-primary' : 'bg-info'}>
        Track 3:
        {' '}
        {track3Time}
      </p>
    </Container>
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
