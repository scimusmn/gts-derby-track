#include "arduino-base/Libraries/SerialController.hpp"
#include "arduino-base/Libraries/Button.h"
#include "track.h"

SerialController serialController;
Button start_btn;
Button track1_start;
Button track2_start;
Button track3_start;

const int solenoid_pin = 6;
int start_pins[] = {10, 11, 12};
int finish_pins[] = {2, 3, 4};
int start_btn_pin = 8;
int start_btn_led = 9;
unsigned long solenoid_time = 0;
Track track1(1, finish_pins[0], &serialController);
Track track2(2, finish_pins[1], &serialController);
Track track3(3, finish_pins[2], &serialController);

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

  start_btn.setup(start_btn_pin, [](int state) {
    if (state == 1)
    {
      serialController.sendMessage("start-button-pressed", "1");
      onParse("racing", 1); //TODO remove once on stele
    }
  });

  // Ensure Serial Port is open and ready to communicate
  serialController.setup(baudRate, &onParse);
  digitalWrite(start_btn_led, HIGH);
}

void loop()
{
  // update SerialController and check for new data
  serialController.update();

  start_btn.update();

  track1_start.update();
  track2_start.update();
  track3_start.update();

  //  if (raceTime > 1000){
  //    digitalWrite(solenoid_pin, LOW);
  //  }

  if (track1.is_Racing)
  {
    track1.watchFinish();
  }
  if (track2.is_Racing)
  {
    track2.watchFinish();
  }
  if (track3.is_Racing)
  {
    track3.watchFinish();
  }

  if (!track1.is_Racing && !track2.is_Racing && !track3.is_Racing)
    digitalWrite(start_btn_led, HIGH);
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
    track1.startRace(solenoid_time);
    track2.startRace(solenoid_time);
    track3.startRace(solenoid_time);
    delay(500);
    digitalWrite(solenoid_pin, LOW);
  }

  else
  {
    // helpfully alert us if we've sent something wrong :)
    serialController.sendMessage("unknown-command", "1");
  }
}
