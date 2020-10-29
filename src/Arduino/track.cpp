/*
  Track.h - Track library for derby track, Gateway to Science
  Joe Meyer created 12/26/2019 at the science museum of mn
*/
#include "Arduino.h"
#include "arduino-base/Libraries/SerialController.hpp"
#include "track.h"

Track::Track(int trackNum, int finish_pin, SerialController *SerialC)
{
  track_num = trackNum;
  finish_beam_pin = finish_pin;
  pinMode(finish_pin, INPUT);
  this->serialController = SerialC;
}

// Public Methods //////////////////////////////////////////////////////////////

void Track::watchFinish(void)
{
  raceTime = millis() - startTime;

  if (!digitalRead(finish_beam_pin))
  {
    is_Racing = false;
    char message[25];
    snprintf(message, 25, "time_track_%d", track_num);
    serialController->sendMessage(message, raceTime);
  }
}

void Track::startRace(unsigned long solenoidTime)
{

  if (digitalRead(finish_beam_pin))
  {
    startTime = solenoidTime;
    is_Racing = true;
    char message[15];
    snprintf(message, 15, "track_%d", track_num);
    serialController->sendMessage(message, "1");
  }
  else
  {
    serialController->sendMessage("finish_sensor_error", track_num);
  }
}

// Private Methods /////////////////////////////////////////////////////////////
