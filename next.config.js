const withTM = require('next-transpile-modules')([
  'colay', 
  'colay-ui',
]); // pass the modules you would like to see transpiled

module.exports = withTM();