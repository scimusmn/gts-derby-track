/*
  Track.h - Track library for derby track, Gateway to Science
  Joe Meyer created 12/26/2019 at the science museum of mn
*/
#include "Arduino.h"
#include "track.h"
#include "arduino-base/Libraries/SerialManager.h"

Track::Track(int solenoid_pin, int start_pin, int finish_pin, SerialManager* SerialM)
{
  start_beam_pin = start_pin;
  finish_beam_pin = finish_pin;
  solenoid_pin = solenoid_pin;
  pinMode(solenoid_pin, OUTPUT);
  pinMode(start_pin, INPUT);
  pinMode(finish_pin, INPUT);
  this->serialManager = SerialM;
}

// Public Methods //////////////////////////////////////////////////////////////

void Track::update(void)
{

  if (digitalRead(finish_beam_pin)){
    is_Racing = false;
    raceTime = millis() - startTime;
    serialManager->sendJsonMessage("Time", raceTime);
  }

}

void Track::startRace(void)
{
  startTime = millis();
  is_Racing = true;
  digitalWrite(solenoid_pin, HIGH);
}

// Private Methods /////////////////////////////////////////////////////////////
