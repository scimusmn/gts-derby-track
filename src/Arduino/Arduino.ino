#include "arduino-base/Libraries/SerialManager.h"
#include "track.h"
#define tone_pin 4


SerialManager serialManager;
int solenoid_pins[] = {5,5,5};
int start_pins[] = {8,9,10};
int finish_pins[] = {6,6,6};
Track track1(1,solenoid_pins[0], start_pins[0], finish_pins[0], &serialManager);
Track track2(2,solenoid_pins[1], start_pins[1], finish_pins[1], &serialManager);
Track track3(3,solenoid_pins[2], start_pins[2], finish_pins[2], &serialManager);


void setup() {
  long baudRate = 115200;
  // Enables/disables debug messaging from ArduinoJson
  boolean arduinoJsonDebug = false;

  // Ensure Serial Port is open and ready to communicate
  serialManager.setup(baudRate, [](char* message, char* value) {
    onParse(message, value);
  }, arduinoJsonDebug);

}

void loop() {
  serialManager.idle();

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

void onParse(char* message, int value) {

//  if (strcmp(message, "led") == 0) {
//    // Turn-on led
//    digitalWrite(ledPin, value);
//  }
//  else if (strcmp(message, "pwm-output") == 0 && value >= 0) {
//    // Set pwm value to pwm pin
//    analogWrite(pwmOutputPin, value);
//    serialManager.sendJsonMessage("pwm-set", value);
//  }
//
  if (strcmp(message, "wake-arduino") == 0 && value == 1) {
    serialManager.sendJsonMessage("arduino-ready", 1);
  }

  else if (strcmp(message, "racing") == 0) {
    tone(tone_pin, 500);
    delay(300);
    noTone(tone_pin);
    delay(300);
    tone(tone_pin, 500);
    delay(300);
    noTone(tone_pin);
    delay(300);
    tone(tone_pin, 500);
    delay(300);
    noTone(tone_pin);
    delay(300);
    tone(tone_pin, 700);
    delay(1000);
    noTone(tone_pin);
    track1.startRace();
    track2.startRace();
    track3.startRace();
  }

  else {
    serialManager.sendJsonMessage("unknown-command", 1);
    serialManager.sendJsonMessage(message, value);
  }
}
