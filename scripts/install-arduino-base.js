const { execSync } = require('child_process');
const fs = require('fs');

// Setup dir structure and install submodule for arduino-base if it does not exist
if (!fs.existsSync('src/Arduino')) {
  execSync('cd src && mkdir -p Arduino');
  execSync('cd src/Arduino && git submodule add https://github.com/scimusmn/arduino-base');
}

// Get the latest submodule reference
execSync('git submodule update --init');

// Install/update arduino-base ReactSerial library dependencies in our root package.json
// In the future, the list of deps might grow so we need to think about potential solutions for that
// But for now, we only need react-scrollable-list
execSync('yarn add react-scrollable-list');
