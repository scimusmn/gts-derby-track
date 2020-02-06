/*
  Track.h - Track library for derby track, Gateway to Science
  Joe Meyer created 12/26/2019 at the science museum of mn
*/
#include "track.h"

Track::Track(int trackNum, int solenoid_p, int start_pin, int finish_pin, SerialController* SerialC)
{
  track_num = trackNum;
  start_beam_pin = start_pin;
  finish_beam_pin = finish_pin;
  solenoid_pin = solenoid_p;
  pinMode(solenoid_pin, OUTPUT);
  pinMode(start_pin, INPUT);
  pinMode(finish_pin, INPUT_PULLUP);
  this->serialController = SerialC;
}

// Public Methods //////////////////////////////////////////////////////////////
void Track::watchStart(void) {
  bool start_beam = digitalRead(start_beam_pin);
  if (start_beam != car_on_start){
    String message = "track_" + track_num;
    message += "_start";
    char val[5];
    snprintf(val,5,"%d",start_beam);
    // serialController->sendMessage(message, val);
    car_on_start = start_beam;
  }
}

void Track::watchFinish(void)
{
  raceTime = millis() - startTime;

  if (raceTime > 1000){
    digitalWrite(solenoid_pin, LOW);
  }

  if (!digitalRead(finish_beam_pin)){
    is_Racing = false;
    String message = "time_track_" + track_num;
    // serialController->sendMessage(message, raceTime);
  }

}

void Track::startRace(void)
{
  if (digitalRead(start_beam_pin)){
    if (digitalRead(finish_beam_pin)){
      startTime = millis();
      is_Racing = true;
      String message = "track_";
      message += track_num;
      // serialController->sendMessage(message, "1");
      digitalWrite(solenoid_pin, HIGH);
    }
    else{
      // serialController->sendMessage("finish_sensor_error", track_num);
    }
  }

}

// Private Methods /////////////////////////////////////////////////////////////
