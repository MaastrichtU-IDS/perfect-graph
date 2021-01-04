module.exports = {
  stories: ['../src/**/*.stories.tsx'],
  addons: [
    '@storybook/preset-create-react-app',
    '@storybook/addon-essentials'
    // {
    //   name: '@storybook/addon-essentials',
    //   options: {}
    // }
  ],
  webpackFinal: require('./webpack.config'),
};

