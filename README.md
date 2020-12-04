# Project: GTS Derby Track
## About
This repo holds the software, created by SMM, for the Gateway To Science Derby Track exhibit (Bismark, ND). It can be installed on any computer capable of running `NodeJS v14` and `Python v2.7`. The software consists of a `Gatsby` app (written in `React`) and an `Arduino` sketch, both interacting as companions to a giant pine-wood derby style race track.

## Usage
The `Gatsby` app displays and ranks racers based on their finishing times for a given race.

The `Arduino` sketch allows the microcontroller (Metro Mini) to start races and capture the race details. It accomplishes this with help from a few sensors, such as:
 - a solenoid, which releases the cars
 - a starting beam break sensor (determines active tracks and time car leaves start)
 - a finish beam break sensor (records race finish time) 

## Install from scratch
To install this app, you'll need to compile it using the following commands:
```
# This will install the node dependencies 
yarn

# This will install arduino-base react dependencies
yarn install:arduino-base

# This builds the app
yarn build

# This servers the app at http://localhost:9000/
yarn serve
```
