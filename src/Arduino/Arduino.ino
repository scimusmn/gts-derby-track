#include "arduino-base/Libraries/SerialController.hpp"
#include "track.h"

SerialController serialController;
const int solenoid_pin = 6;
int start_pins[] = {10, 11, 12};
int finish_pins[] = {2, 3, 4};
int start_btn = 8;
int start_btn_led = 9;
unsigned long solenoid_time = 0;
Track track1(1, start_pins[0], finish_pins[0], &serialController);
Track track2(2, start_pins[1], finish_pins[1], &serialController);
Track track3(3, start_pins[2], finish_pins[2], &serialController);

void setup()
{
  long baudRate = 115200;
  pinMode(solenoid_pin, OUTPUT);

  // Ensure Serial Port is open and ready to communicate
  serialController.setup(baudRate, &onParse);
}

void loop()
{
  // update SerialController and check for new data
  serialController.update();

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
}

void onParse(char *message, char *value)
{
  if (strcmp(message, "wake-arduino") == 0 && strcmp(value, "1") == 0)
  {
    serialController.sendMessage("arduino-ready", "1");
  }

  else if (strcmp(message, "racing") == 0)
  {
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
