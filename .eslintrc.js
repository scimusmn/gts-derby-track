const path = require('path');

module.exports = {
  'extends': 'airbnb',
  'env': {
    'browser': true
  },
  'rules': {
    'import/no-extraneous-dependencies': 'off',
    'react/jsx-filename-extension': [
      1,
      {
        'extensions': [
          '.js',
          '.jsx'
        ]
      }
    ],
  },
  'settings': {
    'import/resolver': {
      'alias': {
        'map': [
          ['@Arduino', path.resolve(__dirname, './src/Arduino')],
          ['@components', path.resolve(__dirname, './src/components')],
          ['@styles', path.resolve(__dirname, './src/styles')]
        ],
        extensions: ['.ts', '.js', '.jsx', '.json']
      }
    }
  }
};