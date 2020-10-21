#include "arduino-base/Libraries/SerialController.hpp"
#include "track.h"
#define tone_pin 4


SerialController serialController;
int solenoid_pins[] = {A2,A3,A4};
int start_pins[] = {8,9,10};
int finish_pins[] = {6,6,6};
Track track1(1,solenoid_pins[0], start_pins[0], finish_pins[0], &serialController);
Track track2(2,solenoid_pins[1], start_pins[1], finish_pins[1], &serialController);
Track track3(3,solenoid_pins[2], start_pins[2], finish_pins[2], &serialController);


void setup() {
  long baudRate = 115200;

  // Ensure Serial Port is open and ready to communicate
  serialController.setup(baudRate, &onParse);
}

void loop() {
  // update SerialController and check for new data
  serialController.idle();

  if (track1.is_Racing){
    track1.watchFinish();
  }
  if (track2.is_Racing){
    track2.watchFinish();
  }
  if (track3.is_Racing){
    track3.watchFinish();
  }

}

void onParse(char* message, char* value) {
  if (strcmp(message, "wake-arduino") == 0 && strcmp(value, "1") == 0) {
    serialController.sendMessage("arduino-ready", "1");
  }

  else if (strcmp(message, "racing") == 0) {
    track1.startRace();
    track2.startRace();
    track3.startRace();
  }

  else {
    // helpfully alert us if we've sent something wrong :)
    serialController.sendMessage("unknown-command", "1");
  }
}
