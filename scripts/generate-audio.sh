#!/bin/bash

FREQ=$1
FREQ_HIGH=$(echo "scale=2; $FREQ * ( 3 / 2 )" | bc -l)

mkdir -p src/audio

sox -V -r 44100 -n -b 16 -c 2 -p synth 0.15 sin $FREQ vol -10dB pad 0.15 1.85 \
| sox - src/audio/stoplight-wait.wav reverb 50 50 20 100 0 fade 0 1.15 2

sox -V -r 44100 -n -b 16 -c 2 -p synth 0.15 sin $FREQ_HIGH vol -12dB pad 0.15 1.85 \
| sox - src/audio/stoplight-go.wav reverb 40 60 20 100 0 fade 0 1.15 2