/*
  Track.h - Track library for derby track, Gateway to Science
  Joe Meyer created 12/26/2019 at the science museum of mn
*/

#include "Arduino.h"

Track::Track(int solenoid_pin, int start_pin, int finish_pin)
{

  pinMode(solenoid_pin, OUTPUT);
  pinMode(start_pin, INPUT);
  pinMode(finish_pin, INPUT);
}

// Public Methods //////////////////////////////////////////////////////////////

void Track::update(void)
{

}

// Private Methods /////////////////////////////////////////////////////////////
