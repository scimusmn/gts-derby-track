#include "arduino-base/Libraries/SerialManager.h"

SerialManager serialManager;

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
//  else if (strcmp(message, "pot-rotation") == 0) {
//    serialManager.sendJsonMessage(message, analogInput1.readValue());
//  }
  if (strcmp(message, "wake-arduino") == 0 && value == 1) {
    serialManager.sendJsonMessage("arduino-ready", 1);
  } else {
    serialManager.sendJsonMessage("unknown-command", 1);
    serialManager.sendJsonMessage(message, value);
  }
}
