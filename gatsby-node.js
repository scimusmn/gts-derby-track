const path = require('path');

exports.onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
    resolve: {
      alias: {
        '@arduino': path.resolve(__dirname, './src/Arduino'),
        '@audio': path.resolve(__dirname, './src/audio'),
        '@components': path.resolve(__dirname, './src/components'),
        '@images': path.resolve(__dirname, './src/images'),
        '@styles': path.resolve(__dirname, './src/styles'),
      },
    },
  });
};
