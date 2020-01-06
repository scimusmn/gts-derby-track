/*
  Track.h - Track library for derby track, Gateway to Science
  Joe Meyer created 12/26/2019 at the science museum of mn
*/
#include "Arduino.h"
#include "track.h"
#include "arduino-base/Libraries/SerialManager.h"

Track::Track(int trackNum, int solenoid_p, int start_pin, int finish_pin, SerialManager* SerialM)
{
  track_num = trackNum;
  start_beam_pin = start_pin;
  finish_beam_pin = finish_pin;
  solenoid_pin = solenoid_p;
  pinMode(solenoid_pin, OUTPUT);
  pinMode(start_pin, INPUT);
  pinMode(finish_pin, INPUT_PULLUP);
  this->serialManager = SerialM;
}

// Public Methods //////////////////////////////////////////////////////////////

void Track::watchFinish(void)
{
  raceTime = millis() - startTime;

  if (raceTime > 1000){
    digitalWrite(solenoid_pin, LOW);
  }

  if (!digitalRead(finish_beam_pin)){
    is_Racing = false;
    String message = "time_track_";
    message += track_num;
    serialManager->sendJsonMessage(message, raceTime);
  }

}

void Track::startRace(void)
{
  startTime = millis();
  is_Racing = true;
  //serialManager->sendJsonMessage("started", solenoid_pin);
  digitalWrite(solenoid_pin, HIGH);
}

// Private Methods /////////////////////////////////////////////////////////////
