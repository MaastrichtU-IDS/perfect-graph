var { merge } = require('webpack-merge');
var createExpoWebpackConfigAsync = require('@expo/webpack-config');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');


module.exports = async function(env, argv) {
  var defaultConfig = await createExpoWebpackConfigAsync({
    ...env,
}, argv);
    var config = merge(
      defaultConfig, 
        {
        module: {
            rules: [
              {
                test: /\.worker\.js$/,
                use: { loader: 'worker-loader' }
              }
            ]
          },
      });
      // if (env.mode === 'production') {
      //   config.plugins.push(
      //     new BundleAnalyzerPlugin({
      //       path: 'web-report',
      //     })
      //   );
      // }
    return config;
};
