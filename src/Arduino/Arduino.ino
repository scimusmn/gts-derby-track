#include "arduino-base/Libraries/SerialController.hpp"
#include "arduino-base/Libraries/Button.h"

SerialController serialController;
Button start_btn;
Button track1_start;
Button track2_start;
Button track3_start;
Button track1_finish;
Button track2_finish;
Button track3_finish;

const int solenoid_pin = 6;
int start_pins[] = {12, 11, 10};
int finish_pins[] = {2, 3, 4};
int start_btn_pin = 8;
int start_btn_led = 9;
bool racing = false;
unsigned long currentMillis = 0, solenoid_time = 0;

void setup()
{
  long baudRate = 115200;
  pinMode(solenoid_pin, OUTPUT);
  pinMode(start_btn_led, OUTPUT);

  track1_start.setup(start_pins[0], [](int state) {
    serialController.sendMessage("track_1_car", state);
  });
  track2_start.setup(start_pins[1], [](int state) {
    serialController.sendMessage("track_2_car", state);
  });
  track3_start.setup(start_pins[2], [](int state) {
    serialController.sendMessage("track_3_car", state);
  });

  track1_finish.setup(finish_pins[0], [](int state) {
    if (state == 1)
    {
      serialController.sendMessage("track_1_time", currentMillis - solenoid_time);
    }
  });
  track2_finish.setup(finish_pins[1], [](int state) {
    if (state == 1)
    {
      serialController.sendMessage("track_2_time", currentMillis - solenoid_time);
    }
  });
  track3_finish.setup(finish_pins[2], [](int state) {
    if (state == 1)
    {
      serialController.sendMessage("track_3_time", currentMillis - solenoid_time);
    }
  });

  start_btn.setup(start_btn_pin, [](int state) {
    if (state == 1)
    {
      serialController.sendMessage("start-button-pressed", "1");
      onParse("racing", 1); //TODO remove once on stele
    }
  });

  track1_finish.debounce = 2;
  track2_finish.debounce = 2;
  track3_finish.debounce = 2;

  // Ensure Serial Port is open and ready to communicate
  serialController.setup(baudRate, &onParse);
  digitalWrite(start_btn_led, HIGH);
}

void loop()
{
  currentMillis = millis();
  // update SerialController and check for new data
  serialController.update();

  //  if (raceTime > 1000){
  //    digitalWrite(solenoid_pin, LOW);
  //  }

  if (racing)
  {
    track1_finish.update();
    track2_finish.update();
    track3_finish.update();
  }

  if (!racing)
  {
    start_btn.update();
    track1_start.update();
    track2_start.update();
    track3_start.update();
  }
}

void onParse(char *message, char *value)
{
  if (strcmp(message, "wake-arduino") == 0 && strcmp(value, "1") == 0)
  {
    serialController.sendMessage("arduino-ready", "1");
  }

  else if (strcmp(message, "racing") == 0)
  {
    digitalWrite(start_btn_led, LOW);
    digitalWrite(solenoid_pin, HIGH);
    solenoid_time = millis();
    racing = true;
    delay(500);
    digitalWrite(solenoid_pin, LOW);
  }

  else if (strcmp(message, "reset") == 0)
  {
    digitalWrite(start_btn_led, HIGH);
    racing = false;
  }
  else
  {
    // helpfully alert us if we've sent something wrong :)
    serialController.sendMessage("unknown-command", "1");
  }
}
