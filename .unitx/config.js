module.exports.type = 'ReactLib' // 'React' | 'ReactLib' | 'Node'
module.exports.updatePackages = ['unitx', 'unitx-ui'] // 'React' | 'ReactLib' | 'Node'

module.exports.configure = function (config) {
  const {
    packageJson, tsConfig, babel, eslint,
  } = config

  return {
    packageJson,
    tsConfig,
    babel,
    eslint,
  }
}
