module.exports = {
  stories: ['../docs/**/*.stories.tsx'],
  addons: [
    '@storybook/preset-create-react-app',
    '@storybook/addon-essentials'
    // {
    //   name: '@storybook/addon-essentials',
    //   options: {}
    // }
  ],
  webpackFinal: require('./_webpack.config'),
};

