#include "arduino-base/Libraries/SerialManager.h"
#include "track.h"
#define tone_pin 4


SerialManager serialManager;
bool is_Racing = false;
int solenoid_pins[] = {1,2};
int start_pins[] = {1,2};
int finish_pins[] = {1,2};
Track track1(solenoid_pins[0], start_pins[0], finish_pins[0], &serialManager);


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
    is_Racing = true;
    startRace();
  }

  else {
    serialManager.sendJsonMessage("unknown-command", 1);
    serialManager.sendJsonMessage(message, value);
  }
}

void startRace() {
  tone(tone_pin, 500);
  delay(500);
  noTone(tone_pin);
  delay(500);
  tone(tone_pin, 500);
  delay(500);
  noTone(tone_pin);
  delay(500);
  tone(tone_pin, 500);
  delay(500);
  noTone(tone_pin);
  delay(500);
  tone(tone_pin, 700);
  delay(1000);
  noTone(tone_pin);

}
