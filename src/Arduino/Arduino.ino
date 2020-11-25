#include "arduino-base/Libraries/SerialController.hpp"
#include "arduino-base/Libraries/Button.h"

//pin assignments EXHIBIT
const int solenoid_pin = 6;
const int start_pins[] = {12, 11, 10};
const int finish_pins[] = {2, 3, 4};
const int start_btn_pin = 8;
const int start_btn_led = 9;

SerialController serialController;
Button start_btn;
Button track1_start;
Button track2_start;
Button track3_start;
Button track1_finish;
Button track2_finish;
Button track3_finish;

void setup()
{
  long baudRate = 115200;
  pinMode(solenoid_pin, OUTPUT);
  pinMode(start_btn_led, OUTPUT);

  //start beam break sensors
  track1_start.setup(start_pins[0], [](int state) {
    serialController.sendMessage("track_1_start", state);
  });
  track2_start.setup(start_pins[1], [](int state) {
    serialController.sendMessage("track_2_start", state);
  });
  track3_start.setup(start_pins[2], [](int state) {
    serialController.sendMessage("track_3_start", state);
  });
  //finish beam break sensors
  track1_finish.setup(finish_pins[0], [](int state) {
    serialController.sendMessage("track_1_finish", state);
  });
  track2_finish.setup(finish_pins[1], [](int state) {
    serialController.sendMessage("track_2_finish", state);
  });
  track3_finish.setup(finish_pins[2], [](int state) {
    serialController.sendMessage("track_3_finish", state);
  });

  start_btn.setup(start_btn_pin, [](int state) {
    if (state == 1)
    {
      serialController.sendMessage("start-button-pressed", "1");
    }
  });

  track1_finish.debounce = 2; //may need adjustmets. Default 20ms doesn't work.
  track2_finish.debounce = 2;
  track3_finish.debounce = 2;

  // Ensure Serial Port is open and ready to communicate
  serialController.setup(baudRate, &onParse);
  digitalWrite(start_btn_led, HIGH);
}

void loop()
{
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

void onParse(char *message, char *value)
{
  if (strcmp(message, "wake-arduino") == 0 && strcmp(value, "1") == 0)
  {
    serialController.sendMessage("arduino-ready", "1");
  }

  else if (strcmp(message, "start_button_lit") == 0)
  {
    if (atoi(value) == 0)
      digitalWrite(start_btn_led, LOW);
    if (atoi(value) == 1)
      digitalWrite(start_btn_led, HIGH);
  }

  else if (strcmp(message, "retract-solenoids") == 0)
  {
    if (atoi(value) == 0)
      digitalWrite(solenoid_pin, LOW);
    if (atoi(value) == 1)
      digitalWrite(solenoid_pin, HIGH);
  }

  else if (strcmp(message, "get-beam-states") == 0)
  {
    serialController.sendMessage("track_1_start", track1_start.state);
    serialController.sendMessage("track_2_start", track2_start.state);
    serialController.sendMessage("track_3_start", track3_start.state);

    serialController.sendMessage("track_1_finish", track1_finish.state);
    serialController.sendMessage("track_2_finish", track2_finish.state);
    serialController.sendMessage("track_3_finish", track3_finish.state);
  }
  else
  {
    // helpfully alert us if we've sent something wrong :)
    serialController.sendMessage("unknown-command", "1");
  }
}
