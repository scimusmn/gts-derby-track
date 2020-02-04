import React, { Component, Fragment } from 'react';
import { Button, Container } from 'reactstrap';
import propTypes from 'prop-types';
import { ARDUINO_READY, WAKE_ARDUINO } from '../Arduino/arduino-base/ReactSerial/arduinoConstants';
import IPC from '../Arduino/arduino-base/ReactSerial/IPCMessages';
import withSerialCommunication from '../Arduino/arduino-base/ReactSerial/SerialHOC';

//
// Serve the app from a subdirectory in production if needed.
//

const RACE = "{ 'message': 'racing', 'value': 1 }";
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      handshake: false,
      pingArduinoStatus: false,
      refreshPortCount: 0,
      track1Time: 0,
      track2Time: 0,
      track3Time: 0,
    };

    this.onSerialData = this.onSerialData.bind(this);
    this.pingArduino = this.pingArduino.bind(this);
    this.refreshPorts = this.refreshPorts.bind(this);
    this.sendClick = this.sendClick.bind(this);
  }

  componentDidMount() {
    const { setOnDataCallback } = this.props;
    setOnDataCallback(this.onSerialData);
    document.addEventListener('keydown', this.handleReset);
    this.pingArduino();
  }

  onSerialData(data) {
    let track1Time;
    let track2Time;
    let track3Time;

    const {
      handshake,
    } = this.state;

    if (data.message === ARDUINO_READY.message) {
      if (!handshake) this.setState({ handshake: true });

      this.setState({
        pingArduinoStatus: false,
        refreshPortCount: 0,
      });
    }
    if (handshake) {
      if (data.message === 'time_track_1') {
        track1Time = data.value;
        this.setState({ track1Time });
      }
      if (data.message === 'time_track_2') {
        track2Time = data.value;
        this.setState({ track2Time });
      }
      if (data.message === 'time_track_3') {
        track3Time = data.value;
        this.setState({ track3Time });
      }
    }
  }

  sendClick(msg) {
    console.log('sendClick:', msg);

    // This is where we pass it through
    // our HOC method to Stele, which passes
    // to Serial device.
    const { sendData } = this.props;
    sendData(msg);
  }

  pingArduino() {
    const { sendData } = this.props;
    const { pingArduinoStatus } = this.state;

    if (pingArduinoStatus) this.refreshPorts();
    this.setState({ pingArduinoStatus: true });
    sendData(JSON.stringify(WAKE_ARDUINO));

    setTimeout(() => { this.pingArduino(); }, 5000);
  }

  refreshPorts() {
    const { sendData, startIpcCommunication, stopIpcCommunication } = this.props;
    const { refreshPortCount } = this.state;

    if (refreshPortCount === 3) {
      this.setState({ handshake: false });

      console.log('sending RESET-PORT');
      sendData(IPC.RESET_PORTS_COMMAND);
      console.log('restarting ipcCommunication...');

      stopIpcCommunication();
      startIpcCommunication();
    }

    this.setState(prevState => ({ refreshPortCount: prevState.refreshPortCount + 1 }));
  }

  render() {
    const {
      handshake, track1Time, track2Time, track3Time,
    } = this.state;
    if (!handshake) {
      return (
        <Container>
          <p> no handshake </p>
        </Container>
      );
    }


    return (
      <Fragment>
        <Container>
          <Button
            color="primary"
            onClick={() => this.sendClick(RACE)}
          >
          Race!
          </Button>
          <p>
            Track 1:
            {track1Time}
          </p>
          <p>
            Track 2:
            {track2Time}
          </p>
          <p>
            Track 3:
            {track3Time}
          </p>
        </Container>
      </Fragment>
    );
  }
}

App.propTypes = {
  sendData: propTypes.func.isRequired,
  setOnDataCallback: propTypes.func.isRequired,
  startIpcCommunication: propTypes.func.isRequired,
  stopIpcCommunication: propTypes.func.isRequired,
};

const AppWithSerialCommunication = withSerialCommunication(App);
export default AppWithSerialCommunication;
