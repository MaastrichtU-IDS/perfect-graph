const path = require('path')
module.exports = {
  stories: ['../stories/**/*.stories.@(tsx|mdx)'],
  addons: [
    '@storybook/preset-create-react-app',
    '@storybook/addon-essentials',
  ],
  webpackFinal: async (config, { configType }) => {
    // `configType` has a value of 'DEVELOPMENT' or 'PRODUCTION'
    // You can change the configuration based on that.
    // 'PRODUCTION' is used when building the static version of storybook.

    // Make whatever fine-grained changes you need
    config.module.rules.push({
      test: /\.css$/i,
      use: ['style-loader', 'css-loader'],
      include: path.resolve(__dirname, '../'),
    });
    // Return the altered config
    return config;
  },
};

