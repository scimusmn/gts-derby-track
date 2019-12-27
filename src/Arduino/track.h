/*
  Track.h - track library for derby track, Gateway to Science
  Joe Meyer created 12/26/2019 at the science museum of mn
*/
#include "Arduino.h"
#include "SerialManager.h"

// ensure this library description is only included once
#ifndef Track_h
#define Track_h

// library interface description
class Track
{
    // user-accessible "public" interface
  public:
    Track(int, int, int, SerialManager*); // solenoid pin, start sensor pin, finish sensor pin.
    void update();
    void startRace();
    SerialManager* serialM;

    // library-accessible "private" interface
  private:
    int solenoid_pin;
    int start_beam_pin;
    int finish_beam_pin;
    unsigned long startTime;
    unsigned long endTime;
    long raceTime;
    bool is_Racing;
};

#endif
