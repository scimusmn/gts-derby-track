// MARBLE DERBY TRACK PINS
//int solenoid_pin = 10;
//bool racing[] = {false, false, false};
//int start_pins[] = {6, 7, 8};
//int finish_pins[] = {2, 3, 4};
//int start_btn = 12;
//int start_btn_led = 13;

// 40Ft EXIBIT PINS
int solenoid_pin = 6;
int led_pin = 13;
bool racing[] = {false, false, false};
int start_pins[] = {10, 11, 12};
int finish_pins[] = {2, 3, 4};
int start_btn = 8;
int start_btn_led = 9;

unsigned long start_time = 0;

void setup()
{
  Serial.begin(115200);
  // put your setup code here, to run once:
  pinMode(solenoid_pin, OUTPUT);
  digitalWrite(solenoid_pin, LOW);
  pinMode(led_pin, OUTPUT);
  digitalWrite(led_pin, LOW);
  pinMode(start_btn, INPUT);
  pinMode(start_btn_led, OUTPUT);

  for (int i = 0; i < 3; i++)
  {
    pinMode(start_pins[i], INPUT);
    pinMode(finish_pins[i], INPUT);
  }
}

void loop()
{
  if (!digitalRead(start_btn))
  {
    digitalWrite(solenoid_pin, HIGH);
    digitalWrite(start_btn_led, LOW);
    delay(500);
    start_time = millis();
    digitalWrite(solenoid_pin, LOW);
    digitalWrite(start_btn_led, HIGH);
  }

  if (!digitalRead(start_pins[0]) && (racing[2] == false))
  {
    Serial.println("track 3 start");
    racing[2] = true;
  }

  if (!digitalRead(start_pins[1]) && (racing[1] == false))
  {
    Serial.println("track 2 start");
    racing[1] = true;
  }

  if (!digitalRead(start_pins[2]) && (racing[0] == false))
  {
    Serial.println("track 1 start");
    racing[0] = true;
  }

  if (!digitalRead(finish_pins[0]))
  {
    if (racing[0] == true)
    {
      Serial.print("Track 1 time:");
      unsigned long finish_time = millis() - start_time;
      Serial.println(finish_time);
      racing[0] = false;
    }
  }

  if (!digitalRead(finish_pins[1]))
  {
    if (racing[1] == true)
    {
      Serial.print("Track 2 time:");
      unsigned long finish_time = millis() - start_time;
      Serial.println(finish_time);
      racing[1] = false;
    }
  }

  if (!digitalRead(finish_pins[2]))
  {
    if (racing[2] == true)
    {
      Serial.print("Track 3 time:");
      unsigned long finish_time = millis() - start_time;
      Serial.println(finish_time);
      racing[2] = false;
    }
  }
}
