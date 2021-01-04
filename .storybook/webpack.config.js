const { merge } = require('webpack-merge')
const { withUnitxExpoWebpackAdapter } = require('unitx/lib/config/webpack/expo')
const  createExpoWebpackConfig = require('../webpack.config')
const fs = require('fs')

module.exports = async (config, { configType }) => {
  const expoConfig = await withUnitxExpoWebpackAdapter(createExpoWebpackConfig, {
    mode: {DEVELOPMENT: 'development', PRODUCTION: 'production'}[configType],
  })
  const configResult = merge(
    expoConfig,
    config,
  )
  return configResult;
}