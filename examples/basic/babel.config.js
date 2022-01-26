module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    "plugins": [
      [
        "module-resolver",
        {
          "extensions": [
            ".js",
            ".jsx",
            ".es",
            ".es6",
            ".mjs",
            ".ts",
            ".tsx",
          ],
          "alias": {
            '@material-ui/core': '@mui/material',
            '@material-ui/icons': '@mui/icons-material',
            '@material-ui/styles': '@mui/styles',
          }
        }
      ],
    ]
  };
};
