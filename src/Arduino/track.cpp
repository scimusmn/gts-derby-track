/*
  Track.h - Track library for derby track, Gateway to Science
  Joe Meyer created 12/26/2019 at the science museum of mn
*/

#include "Arduino.h"

Track::Track(int solenoid_pin, int start_pin, int finish_pin, SerialManager* serialM)
{
  start_beam_pin = start_pin;
  finish_beam_pin = finish_pin;
  solenoid_pin = solenoid_pin;
  pinMode(solenoid_pin, OUTPUT);
  pinMode(start_pin, INPUT);
  pinMode(finish_pin, INPUT);
  serialM = serialM;

}

// Public Methods //////////////////////////////////////////////////////////////

void Track::update(void)
{

  if (digitalRead(finish_pin)){
    is_Racing = false;
    raceTime = millis() - startTime;
    serialM->sendJsonMessage("Time", raceTime)
  }

}

void Track::startRace(void)
{
  startTime = millis();
  is_Racing = true;
  digitalWrite(solenoid_pin, HIGH)
}

// Private Methods /////////////////////////////////////////////////////////////
