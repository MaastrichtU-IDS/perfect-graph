// const R = require('unitx/ramda')
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

  // fs.writeFileSync(
  //   '/Users/turgaysaba/Desktop/projects/perfect-graph-reference/generated/config.json',
  //   circularStringify(config,)
  // )
  // fs.writeFileSync(
  //   '/Users/turgaysaba/Desktop/projects/perfect-graph-reference/generated/expoConfig.json',
  //   circularStringify(expoConfig)
  // )
  // fs.writeFileSync(
  //   '/Users/turgaysaba/Desktop/projects/perfect-graph-reference/generated/result.json',
  //   circularStringify(configResult)
  // )
  return configResult;
}