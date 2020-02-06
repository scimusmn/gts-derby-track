/*
  Track.h - track library for derby track, Gateway to Science
  Joe Meyer created 12/26/2019 at the science museum of mn
*/

// ensure this library description is only included once
#ifndef Track_h
#define Track_h

#include "Arduino.h"
#include "arduino-base/Libraries/SerialController.hpp"


// library interface description
class Track
{
    // user-accessible "public" interface
  public:
    Track(int, int, int, int, SerialController*); // solenoid pin, start sensor pin, finish sensor pin.
    void watchStart();
    void watchFinish();
    void startRace();
    bool is_Racing;

    // library-accessible "private" interface
  private:
    int track_num;
    SerialController* serialController;
    bool car_on_start;
    int solenoid_pin;
    int start_beam_pin;
    int finish_beam_pin;
    unsigned long startTime;
    unsigned long endTime;
    long raceTime;
};

#endif
