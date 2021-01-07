const { merge } = require('webpack-merge')
const { withUnitxExpoWebpackAdapter } = require('unitx/lib/config/webpack/expo')
const  createExpoWebpackConfig = require('../webpack.config')

module.exports = {
  stories: ['../docs/**/*.stories.(tsx|mdx)'],
  addons: [
    '@storybook/preset-create-react-app',
    '@storybook/addon-essentials'
  ],
  webpackFinal: async (config, info = {}) => {
    const { configType= 'DEVELOPMENT' }= info
    const mode = {DEVELOPMENT: 'development', PRODUCTION: 'production'}[configType]
    const expoConfig = await withUnitxExpoWebpackAdapter(createExpoWebpackConfig, {
      mode
    })
    const configResult = merge(
      expoConfig,
      config
    )
    return configResult;
  }
};

