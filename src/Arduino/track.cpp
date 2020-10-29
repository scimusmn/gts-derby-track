/*
  Track.h - Track library for derby track, Gateway to Science
  Joe Meyer created 12/26/2019 at the science museum of mn
*/
#include "Arduino.h"
#include "arduino-base/Libraries/SerialController.hpp"
#include "track.h"

Track::Track(int trackNum, int start_pin, int finish_pin, SerialController *SerialC)
{
  track_num = trackNum;
  start_beam_pin = start_pin;
  finish_beam_pin = finish_pin;
  pinMode(start_pin, INPUT);
  pinMode(finish_pin, INPUT_PULLUP);
  this->serialController = SerialC;
}

// Public Methods //////////////////////////////////////////////////////////////
void Track::watchStart(void)
{
  bool start_beam = !digitalRead(start_beam_pin);
  if (start_beam != car_on_start)
  {
    char val[5];
    snprintf(val, 5, "%d", start_beam);
    char message[25];
    snprintf(message, 25, "track_%d_start", track_num);
    serialController->sendMessage(message, val);
    car_on_start = start_beam;
  }
}

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
  if (!digitalRead(start_beam_pin))
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
}

// Private Methods /////////////////////////////////////////////////////////////
