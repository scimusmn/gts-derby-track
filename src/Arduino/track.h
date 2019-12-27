/*
  Track.h - track library for derby track, Gateway to Science
  Joe Meyer created 12/26/2019 at the science museum of mn
*/
#include "Arduino.h"

// ensure this library description is only included once
#ifndef Track_h
#define Track_h

// library interface description
class Track
{
    // user-accessible "public" interface
  public:
    Source(int, int, int); // solenoid pin, start sensor pin, finish sensor pin.
    void update();

    // library-accessible "private" interface
  private:
    void startRace();
    unsigned long startTime;
    unsigned long endTime;
    long raceTime;
    bool is_Racing;
};

#endif
