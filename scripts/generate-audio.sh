#!/bin/bash

FREQ=$1
FREQ_HIGH=$(echo "scale=2; $FREQ * ( 3 / 2 )" | bc -l)

mkdir -p src/audio

# Create lower pitched stoplight blip
sox -V -r 44100 -n -b 16 -c 2 -p synth 0.15 sin $FREQ vol -10dB pad 0.15 1.85 \
| sox - src/audio/stoplight-wait.wav reverb 50 50 20 100 0 fade 0 1.15 2

# Create higher pitched stoplight blip
sox -V -r 44100 -n -b 16 -c 2 -p synth 0.60 sin $FREQ_HIGH vol -12dB pad 0.15 2.30 \
| sox - src/audio/stoplight-go.wav reverb 40 60 20 100 0 fade 0 1.15 2.30

# sox -V -r 44100 -n -b 16 -c 2 -p synth 0.15 sin $FREQ_HIGH vol -12dB pad 0.15 1.85 \
# | sox - src/audio/stoplight-go.wav reverb 40 60 20 100 0 fade 0 1.15 2

# Generate temporary racing music - song.wav
sox -V -r 44100 -n -b 16 -c 2 square-high.wav synth 2.60 triangle 55 tremolo 6 100 fade .05 0 
sox -V -r 44100 -n -b 16 -c 2 triangle-high.wav synth 2.60 triangle 110 tremolo 6 100 fade .05 0 
sox -V -r 44100 -n -b 16 -c 2 square-low.wav synth 2.60 triangle 48.5 tremolo 6 100 fade .05 0 
sox -V -r 44100 -n -b 16 -c 2 triangle-low.wav synth 2.60 triangle 97 tremolo 6 100 fade .05 0 

sox -m square-high.wav triangle-high.wav high.wav
sox -m square-low.wav triangle-low.wav low.wav

sox high.wav low.wav src/audio/song.wav
rm high* low* square* triangle*