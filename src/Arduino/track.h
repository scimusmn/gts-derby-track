/*
  Track.h - track library for derby track, Gateway to Science
  Joe Meyer created 12/26/2019 at the science museum of mn
*/

#include "Arduino.h"
#include "arduino-base/Libraries/SerialController.hpp"

// ensure this library description is only included once
#ifndef Track_h
#define Track_h

// library interface description
class Track
{
  // user-accessible "public" interface
public:
  Track(int, int, SerialController *); // track number, finish sensor pin.
  void watchFinish();
  void startRace(unsigned long);
  bool is_Racing;

  // library-accessible "private" interface
private:
  int track_num;
  SerialController *serialController;
  int finish_beam_pin;
  unsigned long startTime;
  unsigned long endTime;
  long raceTime;
};

#endif
