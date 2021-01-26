#include "arduino-base/Libraries/Button.h"
#include "arduino-base/Libraries/SerialController.hpp"

// pin assignments 40ft EXHIBIT
const int solenoid_pin = 6;
const int start_pins[] = {10, 11, 12};
const int finish_pins[] = {4, 3, 2};
const int start_btn_pin = 8;
const int start_btn_led = 9;

// pin assignments MINI MARBLE TRACK
// const int solenoid_pin = 10;
// const int start_pins[] = {6, 7, 8};
// const int finish_pins[] = {2, 3, 4};
// const int start_btn_pin = 12;
// const int start_btn_led = 13;

SerialController serialController;
Button start_btn;
Button track1_start;
Button track2_start;
Button track3_start;
Button track1_finish;
Button track2_finish;
Button track3_finish;

boolean track1_start_state = false;
boolean track2_start_state = false;
boolean track3_start_state = false;

void setup() {
  long baudRate = 115200;
  pinMode(solenoid_pin, OUTPUT);
  pinMode(start_btn_led, OUTPUT);

  // start beam break sensors
  track1_start.setup(start_pins[0], [](int state) {
    serialController.sendMessage("track-1-start", state);
    track1_start_state = state;
  });
  track2_start.setup(start_pins[1], [](int state) {
    serialController.sendMessage("track-2-start", state);
    track2_start_state = state;
  });
  track3_start.setup(start_pins[2], [](int state) {
    serialController.sendMessage("track-3-start", state);
    track3_start_state = state;
  });
  // finish beam break sensors
  track1_finish.setup(finish_pins[0], [](int state) {
    serialController.sendMessage("track-1-finish", state);
  });
  track2_finish.setup(finish_pins[1], [](int state) {
    serialController.sendMessage("track-2-finish", state);
  });
  track3_finish.setup(finish_pins[2], [](int state) {
    serialController.sendMessage("track-3-finish", state);
  });

  start_btn.setup(start_btn_pin, [](int state) {
    if (state == 1) {
      serialController.sendMessage("start-button-pressed", "1");
    }
  });

  // may need adjustmets. Default 20ms doesn't work.
  track1_finish.debounce = 2;
  track2_finish.debounce = 2;
  track3_finish.debounce = 2;

  // Ensure Serial Port is open and ready to communicate
  serialController.setup(baudRate, &onParse);
  digitalWrite(start_btn_led, HIGH);
}

void loop() {
  // update SerialController and check for new data
  serialController.update();

  track1_finish.update();
  track2_finish.update();
  track3_finish.update();
  start_btn.update();
  track1_start.update();
  track2_start.update();
  track3_start.update();
}

void onParse(char *message, char *value) {
  if (strcmp(message, "wake-arduino") == 0 && strcmp(value, "1") == 0) {
    serialController.sendMessage("arduino-ready", "1");
  }

  else if (strcmp(message, "start-button-lit") == 0) {
    if (atoi(value) == 0)
      digitalWrite(start_btn_led, LOW);  // Turn the button LED OFF
    if (atoi(value) == 1)
      digitalWrite(start_btn_led, HIGH);  // Turn the button LED ON.
  }

  else if (strcmp(message, "retract-solenoids") == 0) {
    if (atoi(value) == 0)
      digitalWrite(solenoid_pin, LOW);  // solenoids spring up, stopping cars.

    if (atoi(value) == 1)
      digitalWrite(solenoid_pin, HIGH);  // solenoids retract, releasing cars.
  }

  // spit out all states on the racetrack.
  else if (strcmp(message, "get-beam-states") == 0) {
    serialController.sendMessage("track-1-start", track1_start_state);
    serialController.sendMessage("track-2-start", track2_start_state);
    serialController.sendMessage("track-3-start", track3_start_state);

    serialController.sendMessage("track-1-finish", track1_finish.state);
    serialController.sendMessage("track-2-finish", track2_finish.state);
    serialController.sendMessage("track-3-finish", track3_finish.state);
  } else {
    // helpfully alert us if we've sent something wrong :)
    serialController.sendMessage("unknown-command", "1");
  }
}
